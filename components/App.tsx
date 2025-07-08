
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { GeneratedPrompt } from './components/GeneratedPrompt';
import { Loader } from './components/Loader';
import { generateEnhancedPrompt, generateImage } from './services/geminiService';
import { GeneratedImage } from './components/GeneratedImage';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State for image generation
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);


  const handleGeneratePrompt = useCallback(async () => {
    if (!userInput.trim()) {
      setError('Please enter an idea for your prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPrompt('');
    // Reset image state when generating a new prompt
    setGeneratedImageUrl(null);
    setImageError(null);
    setIsGeneratingImage(false);

    try {
      const prompt = await generateEnhancedPrompt(userInput);
      setGeneratedPrompt(prompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userInput]);

  const handleGenerateImage = useCallback(async () => {
    if (!generatedPrompt) return;

    setIsGeneratingImage(true);
    setImageError(null);
    setGeneratedImageUrl(null);

    try {
        const imageUrl = await generateImage(generatedPrompt);
        setGeneratedImageUrl(imageUrl);
    } catch (err) {
        setImageError(err instanceof Error ? err.message : 'An unknown error occurred while generating the image.');
    } finally {
        setIsGeneratingImage(false);
    }
  }, [generatedPrompt]);


  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-3xl mx-auto">
        <Header />
        <main className="mt-8">
          <PromptInput
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onSubmit={handleGeneratePrompt}
            isLoading={isLoading}
          />
          
          {error && (
            <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
              <p>{error}</p>
            </div>
          )}

          {isLoading && (
            <div className="mt-8 flex flex-col items-center justify-center space-y-4">
              <Loader />
              <p className="text-lg text-blue-400 animate-pulse">Enhancing your idea...</p>
            </div>
          )}
          
          {generatedPrompt && !isLoading && (
            <>
              <GeneratedPrompt promptText={generatedPrompt} />
              
              <div className="mt-6 text-center">
                <button
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage}
                  className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100 inline-flex items-center"
                >
                  {isGeneratingImage ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Image...
                    </>
                  ) : (
                    'Generate Image with this Prompt'
                  )}
                </button>
              </div>
            </>
          )}

          <GeneratedImage 
              imageUrl={generatedImageUrl}
              isLoading={isGeneratingImage}
              promptText={generatedPrompt}
              error={imageError}
          />

        </main>
      </div>
    </div>
  );
};

export default App;
