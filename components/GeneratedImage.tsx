import React from 'react';
import { Loader } from './Loader';
import { DownloadIcon } from './icons';

interface GeneratedImageProps {
  imageUrl: string | null;
  isLoading: boolean;
  promptText: string;
  error: string | null;
}

export const GeneratedImage: React.FC<GeneratedImageProps> = ({ imageUrl, isLoading, promptText, error }) => {
  if (isLoading) {
    return (
      <div className="mt-8 w-full flex flex-col items-center justify-center space-y-4">
        <div className="w-full aspect-square bg-gray-800/70 border border-gray-700 rounded-lg flex items-center justify-center">
          <Loader />
        </div>
        <p className="text-lg text-purple-400 animate-pulse">Painting with pixels...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
        <p><strong>Image Generation Failed:</strong> {error}</p>
      </div>
    );
  }

  if (!imageUrl) {
    return null;
  }

  return (
    <div className="mt-8 w-full">
      <h2 className="text-xl font-semibold text-gray-200 mb-2">Your Generated Image:</h2>
      <div className="relative group w-full aspect-square bg-gray-800/70 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
        <img src={imageUrl} alt={promptText} className="w-full h-full object-contain" />
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <p className="text-gray-300 text-sm">{promptText}</p>
        </div>
        <a 
          href={imageUrl} 
          download={`ai-generated-${Date.now()}.jpeg`}
          className="absolute top-3 right-3 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-200"
          aria-label="Download image"
        >
          <DownloadIcon className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
};
