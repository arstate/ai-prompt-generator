import React, { useState, useEffect } from 'react';
import { ClipboardIcon, CheckIcon, DownloadIcon } from './icons';

interface GeneratedPromptProps {
  promptText: string;
}

export const GeneratedPrompt: React.FC<GeneratedPromptProps> = ({ promptText }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setIsCopied(true);
  };

  const handleDownload = () => {
    const blob = new Blob([promptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-prompt-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-8 w-full">
      <h2 className="text-xl font-semibold text-gray-200 mb-2">Your Enhanced Prompt:</h2>
      <div className="relative p-6 bg-gray-800/70 border border-gray-700 rounded-lg shadow-lg">
        <p className="text-gray-300 leading-relaxed font-mono pr-20">{promptText}</p>
        <div className="absolute top-3 right-3 flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-200"
            aria-label="Copy prompt to clipboard"
          >
            {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-200"
            aria-label="Download prompt as a text file"
          >
            <DownloadIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
