import { GoogleGenAI } from "@google/genai";
import { ChatMessage, MessageSender } from '../types';
import { 
  IMAGE_GENERATION_KEYWORDS, 
  IDENTITY_KEYWORDS,
  BIO_REQUEST_KEYWORDS,
  BIO_TRIGGER_KEYWORDS,
  BIO_SUBJECT_KEYWORDS,
  IDENTITY_RESPONSE,
  BIO_RESPONSE
} from '../constants';

if (!process.env.API_KEY) {
  // In a real application, you would handle this more gracefully.
  // For this context, we assume it's set in the environment.
  console.error("API_KEY environment variable not set!");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

enum UserIntent {
  CHAT,
  GENERATE_IMAGE,
  REVISE_IMAGE,
}

// Uses Gemini to create a detailed image prompt from a user request.
async function createVisualPrompt(userRequest: string): Promise<string> {
  const prompt = `You are an expert prompt engineer for a text-to-image AI model. Your task is to convert a simple user request into a rich, detailed, and photorealistic prompt. The prompt MUST be in English. Do not add any conversational text, just output the final prompt. User request: "${userRequest}"`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-preview-04-17',
    contents: prompt,
    config: { thinkingConfig: { thinkingBudget: 0 } }
  });
  
  return response.text.trim();
}

// Uses Gemini to revise an existing image prompt with a new user request.
async function createRevisedPrompt(lastPrompt: string, revisionRequest: string): Promise<string> {
  const prompt = `You are an expert prompt engineer for a text-to-image AI model. Your task is to revise an existing image prompt based on a new user request. The revised prompt MUST be in English and should incorporate the new details seamlessly. Do not add any conversational text, just output the final revised prompt.\n\nExisting Prompt: "${lastPrompt}"\n\nUser's Revision Request: "${revisionRequest}"`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-preview-04-17',
    contents: prompt,
    config: { thinkingConfig: { thinkingBudget: 0 } }
  });

  return response.text.trim();
}

// Uses Imagen 3 to generate an image from a detailed prompt.
async function generateImage(prompt: string): Promise<string> {
  const response = await ai.models.generateImages({
    model: 'imagen-3.0-generate-002',
    prompt: prompt,
    config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
  });

  if (response.generatedImages && response.generatedImages.length > 0) {
    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  }
  throw new Error("Image generation failed to produce an image.");
}

// Uses Gemini for a standard conversational response.
async function getChatResponse(userMessage: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-preview-04-17',
    contents: userMessage,
    config: {
      systemInstruction: 'You are ARSTATE.AI, a helpful and creative AI assistant that speaks Indonesian.',
    }
  });

  return response.text;
}

// Determines the user's intent using an LLM for more accurate revision detection.
async function determineUserIntent(userMessage: string, lastImagePromptExists: boolean): Promise<UserIntent> {
    // If an image was generated before, the highest priority is to check for a revision request.
    if (lastImagePromptExists) {
        const prompt = `You are an intent classification AI. Your task is to determine if the user's message, in Indonesian, is a request to revise a previously generated image, or if it's a normal continuation of a conversation.
The user has already seen an image. Now they have sent this message: "${userMessage}"

If the message is a request to change, modify, add to, remove from, or otherwise alter the previous image, respond with only the word "REVISE".
If the message is a comment, a question about the image ("is it good?", "what is this?"), a compliment, or a new unrelated topic, respond with only the word "CHAT".

Examples:
- User message: "Ubah gambarnya jadi malam hari." -> REVISE
- User message: "Keren banget! Terima kasih." -> CHAT
- User message: "Bisa tambahkan pohon di sebelah kiri?" -> REVISE
- User message: "Menurut kamu bagus gak?" -> CHAT
- User message: "Buat lebih berwarna." -> REVISE
- User message: "hapus orang yang di belakang" -> REVISE

User message: "${userMessage}"
Intent:`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: prompt,
            config: { temperature: 0, thinkingConfig: { thinkingBudget: 0 } }
        });

        const intent = response.text.trim().toUpperCase();
        if (intent === 'REVISE') {
            return UserIntent.REVISE_IMAGE;
        }
    }

    // Check for a new image generation request using keywords for speed and clarity.
    const lowerCaseMessage = userMessage.toLowerCase();
    const isGeneration = IMAGE_GENERATION_KEYWORDS.some(kw => lowerCaseMessage.includes(kw));
    if (isGeneration) {
        return UserIntent.GENERATE_IMAGE;
    }
    
    // If it's not a revision and not a new generation, it's a chat message.
    return UserIntent.CHAT;
}


// Main logic to process user messages and decide the appropriate action.
export async function processUserMessage(
  userMessage: string,
  lastImagePrompt: string | null,
  messages: ChatMessage[]
): Promise<{ message: ChatMessage; newPrompt: string | null }> {
  
  const lowerCaseMessage = userMessage.toLowerCase().trim();

  // 1. Check for a direct request about the creator (e.g., "siapa bachtiar?")
  // This is more specific and should be checked before the general identity question.
  const isDirectBioRequest = BIO_TRIGGER_KEYWORDS.some(trigger => lowerCaseMessage.includes(trigger)) &&
                             BIO_SUBJECT_KEYWORDS.some(subject => lowerCaseMessage.includes(subject));

  if (isDirectBioRequest) {
    return {
      message: {
        id: Date.now().toString(),
        sender: MessageSender.AI,
        type: 'text',
        content: BIO_RESPONSE,
      },
      newPrompt: lastImagePrompt,
    };
  }
  
  // 2. Check for general identity question (e.g., "siapa kamu?")
  if (IDENTITY_KEYWORDS.some(kw => lowerCaseMessage.includes(kw))) {
    return {
      message: {
        id: Date.now().toString(),
        sender: MessageSender.AI,
        type: 'text',
        content: IDENTITY_RESPONSE,
      },
      newPrompt: lastImagePrompt,
    };
  }

  // 3. Check for a follow-up bio request (e.g., "iya, tampilkan")
  const previousMessage = messages.length >= 2 ? messages[messages.length - 2] : null;
  const wasIdentityResponseSent =
    previousMessage &&
    previousMessage.sender === MessageSender.AI &&
    previousMessage.type === 'text' &&
    previousMessage.content === IDENTITY_RESPONSE;
  
  if (wasIdentityResponseSent && BIO_REQUEST_KEYWORDS.some(kw => lowerCaseMessage.includes(kw))) {
     return {
      message: {
        id: Date.now().toString(),
        sender: MessageSender.AI,
        type: 'text',
        content: BIO_RESPONSE,
      },
      newPrompt: lastImagePrompt,
    };
  }


  try {
    const intent = await determineUserIntent(userMessage, !!lastImagePrompt);

    switch (intent) {
      case UserIntent.REVISE_IMAGE:
        // This case is only reachable if lastImagePrompt is not null.
        const revisedPrompt = await createRevisedPrompt(lastImagePrompt!, userMessage);
        const imageUrlRevise = await generateImage(revisedPrompt);
        return {
          message: {
            id: Date.now().toString(),
            sender: MessageSender.AI,
            type: 'image',
            imageUrl: imageUrlRevise,
            prompt: revisedPrompt,
          },
          newPrompt: revisedPrompt,
        };

      case UserIntent.GENERATE_IMAGE:
        const visualPrompt = await createVisualPrompt(userMessage);
        const imageUrlGen = await generateImage(visualPrompt);
        return {
          message: {
            id: Date.now().toString(),
            sender: MessageSender.AI,
            type: 'image',
            imageUrl: imageUrlGen,
            prompt: visualPrompt,
          },
          newPrompt: visualPrompt,
        };

      case UserIntent.CHAT:
      default:
        const chatText = await getChatResponse(userMessage);
        return {
          message: {
            id: Date.now().toString(),
            sender: MessageSender.AI,
            type: 'text',
            content: chatText,
          },
          newPrompt: lastImagePrompt, // No change to the prompt
        };
    }

  } catch (error) {
    console.error("AI Service Error:", error);
    return {
      message: {
        id: Date.now().toString(),
        sender: MessageSender.AI,
        type: 'text',
        content: 'Maaf, terjadi kesalahan saat memproses permintaan Anda. Mungkin ada masalah dengan API. Silakan coba lagi nanti.'
      },
      newPrompt: lastImagePrompt,
    };
  }
}