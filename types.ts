export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  featured?: boolean;
}

export interface Post {
  id: string;
  title: string;
  date: string;
  // 外部链接或 public/ 下的文件路径，例如 '/blogs/doc.pdf'
  link?: string;
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