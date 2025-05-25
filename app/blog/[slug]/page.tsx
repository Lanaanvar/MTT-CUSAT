'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { Blog } from '@/app/types';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function BlogPost({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const blogsQuery = query(
        collection(db, 'blogs'),
        where('slug', '==', slug),
        where('isPublished', '==', true)
      );
      const querySnapshot = await getDocs(blogsQuery);
      
      if (querySnapshot.empty) {
        router.push('/blog');
        return;
      }

      const blogData = {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data(),
        createdAt: querySnapshot.docs[0].data().createdAt?.toDate(),
        updatedAt: querySnapshot.docs[0].data().updatedAt?.toDate(),
      } as Blog;
      
      setBlog(blogData);
    } catch (error) {
      console.error('Error fetching blog:', error);
      router.push('/blog');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <img
        src={blog.coverImage}
        alt={blog.title}
        className="w-full h-[400px] object-cover rounded-lg shadow-lg mb-8"
      />
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      <div className="flex items-center text-gray-600 mb-8">
        <span className="mr-4">By {blog.author}</span>
        <time>{format(blog.createdAt, 'MMMM dd, yyyy')}</time>
      </div>
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </article>
  );
} 