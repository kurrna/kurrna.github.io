export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  stars: number;
  featured?: boolean;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
}

export interface Link {
  platform: string;
  url: string;
  iconName: string; 
}

export enum SectionId {
  HOME = 'home',
  PROJECTS = 'projects',
  RESUME = 'resume',
  BLOG = 'blog',
}