import React from 'react';
import { Send } from 'lucide-react';

const InputArea = ({ inputValue, onInputChange, onSendMessage, isGenerating }) => (
  <div className="border-t border-gray-200 bg-white p-4">
    <div className="max-w-4xl mx-auto">
      <div className="flex items-end space-x-4">
        <div className="flex-1 relative">
          <textarea
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="What would you like to write about? Be specific for better results..."
            className="w-full p-4 border border-gray-300 rounded-2xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows="3"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
          />
        </div>
        <button
          onClick={onSendMessage}
          disabled={!inputValue.trim() || isGenerating}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white p-4 rounded-2xl transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      <div className="text-xs text-gray-500 mt-2 text-center">
        Press Enter to send, Shift + Enter for new line
      </div>
    </div>
  </div>
);

export default InputArea;