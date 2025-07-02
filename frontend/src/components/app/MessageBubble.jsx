// import React from 'react';
// import ReactMarkdown from 'react-markdown';
// import { Sparkles, Copy, Download } from 'lucide-react';

// const MessageBubble = ({ message }) => (
//   <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
//     <div className={`max-w-3xl ${message.type === 'user' ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200'} rounded-2xl p-4`}>
//       {message.type === 'user' ? (
//         <div>{message.content}</div>
//       ) : (
//         <div>
//           <div className="flex items-center justify-between mb-3">
//             <div className="flex items-center space-x-2">
//               <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
//                 <Sparkles className="w-3 h-3 text-white" />
//               </div>
//               <span className="font-medium text-gray-800">BlogAI</span>
//             </div>
//             <div className="flex space-x-2">
//               <button className="p-1 hover:bg-gray-100 rounded">
//                 <Copy className="w-4 h-4 text-gray-600" />
//               </button>
//               <button className="p-1 hover:bg-gray-100 rounded">
//                 <Download className="w-4 h-4 text-gray-600" />
//               </button>
//             </div>
//           </div>

//           {/* ✅ Renders blog with proper markdown */}
//           <div className="prose prose-sm max-w-none text-gray-800">
//             <ReactMarkdown>{message.content}</ReactMarkdown>
//           </div>
//         </div>
//       )}
//     </div>
//   </div>
// );

// export default MessageBubble;

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Sparkles, Copy, Download } from 'lucide-react';

const MessageBubble = ({ message }) => {
  if (!message?.content) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const handleDownload = () => {
    const blob = new Blob([message.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${message.id || 'blog'}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
      <div
        className={`max-w-3xl inline-block ${
          message.type === 'user'
            ? 'bg-purple-600 text-white'
            : 'bg-white border border-gray-200'
        } rounded-2xl p-4 shadow`}
      >
        {message.type === 'user' ? (
          <div>{message.content}</div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium text-gray-800">BlogAI</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleCopy}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Copy"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Download"
                >
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* ✅ Markdown rendering with full support */}
            <div className="prose max-w-none text-gray-800 [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
