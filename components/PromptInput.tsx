
import React from 'react';

interface PromptInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ value, onChange, onSubmit, isLoading }) => {
  return (
    <div className="w-full">
      <label htmlFor="prompt-input" className="block text-lg font-medium text-gray-300 mb-2">
        Enter your prompt idea in any language
      </label>
      <textarea
        id="prompt-input"
        value={value}
        onChange={onChange}
        placeholder="e.g., seekor naga di atas gunung berapi"
        className="w-full h-32 p-4 bg-gray-800 border-2 border-gray-700 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none placeholder-gray-500"
        disabled={isLoading}
      />
      <button
        onClick={onSubmit}
        disabled={isLoading || !value.trim()}
        className="mt-4 w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100"
      >
        {isLoading ? 'Generating...' : 'Enhance Prompt'}
      </button>
    </div>
  );
};
