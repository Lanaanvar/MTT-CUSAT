'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { Blog } from '@/app/types';
import { toast } from 'react-hot-toast';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { uploadImage } from '@/app/utils/cloudinary';

interface BlogEditorProps {
  blogId?: string;
}

export default function BlogEditor({ blogId }: BlogEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState<Partial<Blog>>({
    title: '',
    content: '',
    coverImage: '',
    author: '',
    excerpt: '',
    isPublished: false,
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: blog.content,
    onUpdate: ({ editor }) => {
      setBlog(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  useEffect(() => {
    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  useEffect(() => {
    if (editor && blog.content && !editor.isDestroyed) {
      editor.commands.setContent(blog.content);
    }
  }, [blog.content, editor]);

  const fetchBlog = async () => {
    try {
      const blogDoc = await getDoc(doc(db, 'blogs', blogId!));
      if (blogDoc.exists()) {
        setBlog(blogDoc.data() as Blog);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Failed to fetch blog');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const imageUrl = await uploadImage(file);
      setBlog((prev) => ({ ...prev, coverImage: imageUrl }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, shouldPublish: boolean) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const blogData = {
        ...blog,
        isPublished: shouldPublish,
        slug: blog.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        updatedAt: new Date(),
        createdAt: blog.createdAt || new Date(),
      };

      if (blogId) {
        await updateDoc(doc(db, 'blogs', blogId), blogData);
        toast.success(shouldPublish ? 'Blog published successfully' : 'Blog saved as draft');
      } else {
        const newBlogRef = doc(collection(db, 'blogs'));
        await setDoc(newBlogRef, { ...blogData, id: newBlogRef.id });
        toast.success(shouldPublish ? 'Blog published successfully' : 'Blog saved as draft');
      }

      router.push('/admin/blogs');
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error('Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, blog.isPublished)} className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={blog.title}
              onChange={(e) => setBlog((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input
              type="text"
              value={blog.author}
              onChange={(e) => setBlog((prev) => ({ ...prev, author: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="flex-1 p-2 border rounded-md"
            />
            {loading && <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-500"></div>}
          </div>
          {blog.coverImage && (
            <div className="mt-2 relative group">
              <img
                src={blog.coverImage}
                alt="Cover preview"
                className="h-40 w-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setBlog((prev) => ({ ...prev, coverImage: '' }))}
                  className="text-white bg-red-500 px-3 py-1 rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
          <textarea
            value={blog.excerpt}
            onChange={(e) => setBlog((prev) => ({ ...prev, excerpt: e.target.value }))}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            required
            placeholder="Write a brief summary of your blog post..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 border-b px-4 py-2">
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`p-1 rounded ${editor?.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`p-1 rounded ${editor?.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`p-1 rounded ${editor?.isActive('heading', { level: 2 }) ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={`p-1 rounded ${editor?.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
                >
                  •
                </button>
              </div>
            </div>
            <EditorContent editor={editor} className="prose prose-sm max-w-none min-h-[400px] p-4" />
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {loading ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
} 