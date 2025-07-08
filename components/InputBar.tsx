
import React, { useState } from 'react';

interface InputBarProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const SendIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
);


const InputBar: React.FC<InputBarProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <div className="px-4 py-3 md:px-6 border-t border-gray-700/50 bg-gray-900/80 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3 max-w-4xl mx-auto">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message or image request..."
          disabled={isLoading}
          className="flex-grow bg-gray-800 border border-gray-600 rounded-full py-3 px-5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-full p-3 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-200 transform enabled:hover:scale-110"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default InputBar;
