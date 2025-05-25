'use client';

import BlogEditor from '../../components/BlogEditor';

export default function EditBlog({ params }: { params: { id: string } }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Blog</h1>
      <BlogEditor blogId={params.id} />
    </div>
  );
} 