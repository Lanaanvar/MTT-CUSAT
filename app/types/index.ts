export interface Blog {
  id: string;
  title: string;
  content: string;
  coverImage: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  excerpt: string;
  slug: string;
  isPublished: boolean;
} 