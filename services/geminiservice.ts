// This service now acts as a client to our own serverless function.

const callApi = async (type: 'enhance' | 'image', payload: object) => {
    const endpoint = '/.netlify/functions/gemini';
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type, payload }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error calling serverless function for type '${type}':`, error);
        if (error instanceof Error) {
            throw new Error(`Failed to communicate with the AI service. Details: ${error.message}`);
        }
        throw new Error("An unknown error occurred while communicating with the server.");
    }
};

export const generateEnhancedPrompt = async (userInput: string): Promise<string> => {
    const data = await callApi('enhance', { userInput });
    if (!data.prompt) {
        throw new Error("The AI returned an invalid response for the prompt.");
    }
    return data.prompt;
};

export const generateImage = async (prompt: string): Promise<string> => {
    const data = await callApi('image', { prompt });
    if (!data.imageUrl) {
        throw new Error("The AI returned an invalid response for the image.");
    }
    return data.imageUrl;
};
