import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: 'bg-green-800',
    error: 'bg-red-800',
    info: 'bg-fifi-700'
  };

  return (
    <div className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 z-[200] flex items-center px-6 py-3 rounded-full shadow-2xl ${bgColors[type]} text-white transition-all duration-500 animate-bounce-in`}>
      <span className="mr-2 text-xl">
        {type === 'success' && '✨'}
        {type === 'error' && '🥀'}
        {type === 'info' && '🍂'}
      </span>
      <span className="font-medium text-sm sm:text-base">{message}</span>
    </div>
  );
};