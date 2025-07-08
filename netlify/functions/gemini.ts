
import { GoogleGenAI } from "@google/genai";

// This interface is a basic representation of Netlify's event object
interface NetlifyEvent {
    body: string;
}

const API_KEY = process.env.API_KEY;

const META_PROMPT_TEMPLATE = `
You are an expert AI prompt engineer. Your task is to take a user's idea, which can be in any language, and transform it into a detailed, effective, and well-structured prompt in ENGLISH, suitable for advanced AI models (like text-to-image or text-to-text generators).
**Instructions:**
1.  **Analyze and Translate:** Identify the core concept of the user's input, even if it's brief or in a language other than English. Translate it accurately to English.
2.  **Elaborate and Enhance:** Add rich, descriptive details, context, and specific keywords that would improve the AI's output. Consider aspects like artistic style (e.g., "cinematic," "photorealistic," "vaporwave," "Studio Ghibli style"), lighting (e.g., "dramatic lighting," "soft morning light"), composition (e.g., "wide-angle shot," "close-up"), mood (e.g., "serene," "eerie," "energetic"), and level of detail.
3.  **Structure for AI:** Format the output as a clear, single block of text. Use comma-separated keywords and phrases.
4.  **Final Output:** Your response MUST ONLY be the final, refined English prompt. DO NOT include any extra text, explanations, conversational filler, titles, or markdown formatting like "Prompt:" or backticks. Just the raw, enhanced prompt text.
**User's Idea:**
"{USER_INPUT}"
**Your Output (English Prompt Only):**
`;

const handler = async (event: NetlifyEvent) => {
    if (!API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "API_KEY environment variable is not set on the server." }),
        };
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    try {
        const { type, payload } = JSON.parse(event.body);

        if (type === 'enhance') {
            const { userInput } = payload;
            if (!userInput) throw new Error("userInput is required for enhancing prompt.");

            const fullPrompt = META_PROMPT_TEMPLATE.replace('{USER_INPUT}', userInput);
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-preview-04-17',
                contents: fullPrompt,
                config: {
                    thinkingConfig: { thinkingBudget: 0 }
                }
            });
            const text = response.text.trim();
            if (!text) throw new Error("The AI returned an empty response.");
            
            return {
                statusCode: 200,
                body: JSON.stringify({ prompt: text }),
            };
        }

        if (type === 'image') {
            const { prompt } = payload;
            if (!prompt) throw new Error("prompt is required for generating image.");

            const response = await ai.models.generateImages({
                model: 'imagen-3.0-generate-002',
                prompt: prompt,
                config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
            });

            if (!response.generatedImages || response.generatedImages.length === 0) {
                throw new Error("The AI did not return any images.");
            }
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

            return {
                statusCode: 200,
                body: JSON.stringify({ imageUrl }),
            };
        }

        throw new Error(`Invalid request type: ${type}`);

    } catch (error) {
        console.error("Error processing request:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error instanceof Error ? error.message : "An unknown internal error occurred." }),
        };
    }
};

export { handler };
