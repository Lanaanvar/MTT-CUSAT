'use client';

import { use } from 'react';
import BlogEditor from '../../components/BlogEditor';

export default function EditBlog({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Blog</h1>
      <BlogEditor blogId={resolvedParams.id} />
    </div>
  );
} 