'use client';

import BlogEditor from '../components/BlogEditor';

export default function NewBlog() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Blog</h1>
      <BlogEditor />
    </div>
  );
} 