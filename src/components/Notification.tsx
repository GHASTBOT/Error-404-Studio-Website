import React from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  show: boolean;
  onDismiss: () => void;
}

export function Notification({ message, type, show, onDismiss }: NotificationProps) {
  if (!message) return null;

  return (
    <div className={`fixed top-20 right-4 z-[9999] transition-all duration-300 transform ${
      show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`relative px-6 py-4 rounded-lg shadow-2xl border backdrop-blur-md ${
        type === 'success' 
          ? 'bg-green-900/90 border-green-500/50 text-green-100' 
          : 'bg-red-900/90 border-red-500/50 text-red-100'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}>
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-tight">{message}</p>
          </div>
          <button
            onClick={onDismiss}
            className="bedrock-button flex-shrink-0 ml-2 text-current opacity-70 hover:opacity-100 !p-1 !bg-transparent hover:!bg-white/10"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}