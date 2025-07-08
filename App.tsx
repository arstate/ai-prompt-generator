import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage, MessageSender } from './types';
import { processUserMessage } from './services/aiService';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'initial-welcome',
      sender: MessageSender.AI,
      type: 'text',
      content: 'Hello! I am ARSTATE.AI. You can chat with me, or ask me to create an image, for example: "Buatkan saya gambar astronot menunggangi kuda di Mars".'
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastImagePrompt, setLastImagePrompt] = useState<string | null>(null);

  const handleSendMessage = useCallback(async (inputText: string) => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: MessageSender.USER,
      type: 'text',
      content: inputText,
    };

    const updatedMessagesWithUser = [...messages, userMessage];
    setMessages(updatedMessagesWithUser);
    setIsLoading(true);

    try {
      const { message: aiMessage, newPrompt } = await processUserMessage(inputText, lastImagePrompt, updatedMessagesWithUser);
      setMessages(prev => [...prev, aiMessage]);
      if (newPrompt !== lastImagePrompt) { 
        setLastImagePrompt(newPrompt);
      }
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '-error',
        sender: MessageSender.AI,
        type: 'text',
        content: "Sorry, I encountered an error. Please try again."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, lastImagePrompt]);

  return (
    <div className="bg-gray-900 text-white h-screen w-screen flex flex-col font-sans">
      <header className="p-4 border-b border-gray-700/50 shadow-lg bg-gray-900/80 backdrop-blur-sm z-10">
        <h1 className="text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
          ARSTATE.AI
        </h1>
      </header>
      <ChatWindow messages={messages} isLoading={isLoading} />
      <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;
