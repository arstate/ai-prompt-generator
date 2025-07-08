
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
        AI Prompt Enhancer
      </h1>
      <p className="mt-2 text-lg text-gray-400">
        Transform your simple ideas into powerful, detailed AI prompts in English.
      </p>
    </header>
  );
};
