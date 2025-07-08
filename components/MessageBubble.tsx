import React from 'react';
import { ChatMessage, MessageSender } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
}

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === MessageSender.USER;

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `arstate-ai-${Date.now()}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`rounded-xl p-1 max-w-lg md:max-w-xl shadow-md ${
          isUser
            ? 'bg-gradient-to-br from-blue-600 to-indigo-700'
            : 'bg-gray-700'
        }`}
      >
        {message.type === 'text' ? (
          <p className="px-3 py-2 text-white text-base leading-relaxed break-words whitespace-pre-line">
            {message.content}
          </p>
        ) : (
          <div className="p-1 flex flex-col gap-2">
            <img
              src={message.imageUrl}
              alt={message.prompt}
              className="rounded-lg w-full h-auto object-cover"
              onLoad={(e) => (e.target as HTMLImageElement).style.opacity = '1'}
              style={{opacity: '0', transition: 'opacity 0.5s'}}
            />
            <button
              onClick={() => handleDownload(message.imageUrl)}
              className="w-full flex items-center justify-center py-2 bg-black/20 hover:bg-black/40 rounded-lg text-white font-semibold transition-colors duration-200 text-sm"
            >
                <DownloadIcon className="w-4 h-4 mr-2" />
                <span>Download</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
