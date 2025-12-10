
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Product } from '@/lib/types';
import { sendMessageToGemini } from '@/lib/geminiService';

interface ChatWidgetProps {
  products: Product[];
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Hi there! I\'m Fifi\'s AI assistant. I love chatting about our handmade bags! Ask me anything or upload a photo for inspiration! 🌸' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    const imageToSend = selectedImage || undefined;
    setSelectedImage(null); // Clear image after sending
    setIsLoading(true);

    // Call Gemini with current product list
    const responseText = await sendMessageToGemini(userMessage.text, products, imageToSend);

    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-fifi-100 flex flex-col overflow-hidden transition-all transform origin-bottom-right">
          {/* Header */}
          <div className="bg-gradient-to-r from-fifi-500 to-fifi-600 p-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white p-1 rounded-full mr-2">
                <span className="text-lg">👩‍🎨</span>
              </div>
              <h3 className="text-white font-bold">Chat with Fifi</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-fifi-100 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="h-80 overflow-y-auto p-4 bg-fifi-50 space-y-4 scrollbar-hide">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${msg.role === 'user'
                    ? 'bg-fifi-500 text-white rounded-br-none'
                    : 'bg-white text-gray-700 rounded-bl-none border border-fifi-100'
                    }`}
                >
                  {msg.image && (
                    <img src={msg.image} alt="Upload" className="mb-2 rounded-lg max-h-32 object-cover border border-white/20" />
                  )}
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-500 rounded-2xl rounded-bl-none px-4 py-2 text-sm shadow-sm border border-fifi-100 flex items-center space-x-1">
                  <span className="w-2 h-2 bg-fifi-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-fifi-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-fifi-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100">
            {selectedImage && (
              <div className="flex items-center mb-2 bg-fifi-50 p-1 rounded-lg">
                <span className="text-xs text-fifi-600 truncate flex-1">Image selected</span>
                <button type="button" onClick={() => setSelectedImage(null)} className="text-gray-400 hover:text-red-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-400 hover:text-fifi-500 transition-colors p-1"
                title="Upload image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about a bag..."
                className="flex-1 focus:outline-none text-sm text-gray-700 placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={(!inputText && !selectedImage) || isLoading}
                className="bg-fifi-500 text-white rounded-full p-2 hover:bg-fifi-600 disabled:opacity-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        id="chat-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'hidden' : 'flex'} items-center justify-center w-14 h-14 bg-fifi-600 rounded-full shadow-lg hover:bg-fifi-700 hover:scale-105 transition-all duration-200 focus:outline-none ring-4 ring-fifi-100`}
      >
        <span className="text-2xl">💬</span>
      </button>
    </div>
  );
};
