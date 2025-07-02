// // import React, { useState } from 'react';
// // import ReactMarkdown from 'react-markdown';

// // const BlogDisplay = ({ blog }) => {
// //   if (!blog) return null;

// //   const [imageError, setImageError] = useState(false);

// //   const today = new Date().toLocaleDateString("en-IN", {
// //     year: 'numeric',
// //     month: 'long',
// //     day: 'numeric'
// //   });

// //   return (
// //     <div className="max-w-4xl mx-auto mt-10 bg-white shadow-2xl rounded-2xl overflow-hidden">

// //       {/* 🖼️ Auto Image or Fallback */}
// //       {!imageError && blog.image_url ? (
// //         <img
// //           src={blog.image_url}
// //           alt="Blog Visual"
// //           className="w-full h-64 object-cover rounded-t-2xl"
// //           onError={() => setImageError(true)}
// //         />
// //       ) : (
// //         <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-100 rounded-t-2xl text-gray-500 px-4 text-center">
// //           <p className="text-lg font-semibold">🖼️ No image found automatically</p>
// //           <p className="text-sm mt-1">You can search manually below:</p>
// //           <a
// //             href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(blog.topic || blog.title || "blog")}`}
// //             target="_blank"
// //             rel="noopener noreferrer"
// //             className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
// //           >
// //             🔍 Search on Google Images
// //           </a>
// //         </div>
// //       )}

// //       {/* 📝 Blog Content */}
// //       <div className="px-8 py-6">
// //         <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
// //           {blog.title}
// //         </h1>
// //         <p className="text-sm text-gray-500 mb-6">
// //           🗓️ {today} • ✍️ By AutoBlog.AI
// //         </p>
// //         <div className="prose prose-lg prose-indigo max-w-none">
// //           <ReactMarkdown>{blog.content}</ReactMarkdown>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default BlogDisplay;

// import React from 'react';
// import ReactMarkdown from 'react-markdown';

// const BlogDisplay = ({ blog }) => {
//   if (!blog) return null;

//   const today = new Date().toLocaleDateString("en-IN", {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
//   });

//   return (
//     <div className="max-w-4xl mx-auto mt-10 bg-white shadow-2xl rounded-2xl overflow-hidden">

//       {/* 🔍 Always show Google image search suggestion */}
//       <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-100 rounded-t-2xl text-gray-500 px-4 text-center">
//         <p className="text-lg font-semibold">🖼️ No image inserted</p>
//         <p className="text-sm mt-1">You can search manually below:</p>
//         <a
//           href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(blog.topic || blog.title || "blog")}`}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
//         >
//           🔍 Search on Google Images
//         </a>
//       </div>

//       {/* 📝 Blog Content */}
//       <div className="px-8 py-6">
//         <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
//           {blog.title}
//         </h1>
//         <p className="text-sm text-gray-500 mb-6">
//           🗓️ {today} • ✍️ By AutoBlog.AI
//         </p>
//         <div className="prose prose-lg prose-indigo max-w-none">
//           <ReactMarkdown>{blog.content}</ReactMarkdown>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogDisplay;

// src/components/app/BlogDisplay.jsx
// import React from 'react';
// import ReactMarkdown from 'react-markdown';

// const BlogDisplay = ({ blog }) => {
//   if (!blog) return null;

//   const today = new Date().toLocaleDateString("en-IN", {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
//   });

//   return (
//     <div className="max-w-4xl mx-auto mt-10 bg-white shadow-2xl rounded-2xl overflow-hidden">
//       {/* 🔍 Google Image Fallback */}
//       <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-100 rounded-t-2xl text-gray-500 px-4 text-center">
//         <p className="text-lg font-semibold">🖼️ No image inserted</p>
//         <p className="text-sm mt-1">You can search manually below:</p>
//         <a
//           href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(blog.topic || blog.title || "blog")}`}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
//         >
//           🔍 Search on Google Images
//         </a>
//       </div>

//       {/* 📝 Blog Content */}
//       <div className="px-8 py-6">
//         <div className="flex items-center justify-between mb-2">
//           <h1 className="text-4xl font-serif font-bold text-gray-900">
//             {blog.title}
//           </h1>
//           <button
//             onClick={() => navigator.clipboard.writeText(blog.content)}
//             className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
//             title="Copy Blog Content"
//           >
//             📋 Copy
//           </button>
//         </div>

//         <p className="text-sm text-gray-500 mb-6">
//           🗓️ {today} • ✍️ By AutoBlog.AI
//         </p>

//         <div className="prose prose-lg prose-indigo max-w-none">
//           <ReactMarkdown>{blog.content}</ReactMarkdown>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogDisplay;

import React from 'react';
import ReactMarkdown from 'react-markdown';

const BlogDisplay = ({ blog }) => {
  if (!blog) return null;

  const today = new Date().toLocaleDateString("en-IN", {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-2xl rounded-2xl overflow-hidden">
      {/* 🔍 Google Image Fallback */}
      <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-100 rounded-t-2xl text-gray-500 px-4 text-center">
        <p className="text-lg font-semibold">🖼️ No image inserted</p>
        <p className="text-sm mt-1">You can search manually below:</p>
        <a
          href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(blog.topic || blog.title || "blog")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          🔍 Search on Google Images
        </a>
      </div>

      {/* 📝 Blog Content */}
      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-5xl font-bold leading-tight text-gray-900">
            {/* Optional Gradient Text (Uncomment to use)
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              {blog.title}
            </span>
            */}
            {blog.title || "Untitled Blog"}
          </h1>

          <button
            onClick={() => navigator.clipboard.writeText(blog.content)}
            className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            title="Copy Blog Content"
          >
            📋 Copy
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          🗓️ {today} • ✍️ By AutoBlog.AI
        </p>

        <div className="prose max-w-none prose-indigo text-gray-800 [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl">
  <ReactMarkdown>{blog.content}</ReactMarkdown>
</div>

      </div>
    </div>
  );
};

export default BlogDisplay;
