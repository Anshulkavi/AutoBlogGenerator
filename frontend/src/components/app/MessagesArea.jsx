import React, { useRef, useEffect } from 'react';
import WelcomeScreen from './WelcomeScreen';
import MessageBubble from './MessageBubble';
import LoadingIndicator from './LoadingIndicator';

const MessagesArea = ({ messages, isGenerating, onSampleClick }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <WelcomeScreen onSampleClick={onSampleClick} />
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isGenerating && <LoadingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};


export default MessagesArea;
