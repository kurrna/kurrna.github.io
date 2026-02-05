import { Experience, Post, Project, Link } from './types';

export const PROFILE = {
  name: "Kurna",
  role: "本科在读",
  bio: "北京航空航天大学 2023 级计算机科学本科生，热爱编程与技术，乐于学习新的知识",
  location: "北京海淀",
  email: "kurna@foxmail.com",
  github: "https://github.com/kurrna",
  blog: "https://kurrna.github.io",
  resume: "/resume.pdf"
};

export const SKILLS = [
  "Java", "C/C++", "Python", "Git", "SQL"
];

export const EXPERIENCE: Experience[] = [
  {
    id: "1",
    role: "本科在读",
    company: "北京航空航天大学 计算机学院",
    period: "2023.09 - 至今",
    description: "GPA 3.6/4.0",
    skills: ["计算机组成原理", "操作系统", "编译原理", "数据结构与算法"],
  }
];

export const PROJECTS: Project[] = [
  {
    id: "1",
    title: "SysY 编译器（编译原理课设）",
    description: "实现 SysY 语言到 mips 汇编的编译器",
    tags: ["Java", "LLVM", "mips"],
    link: "https://github.com/kurrna/SysY_Compiler",
    featured: false,
  },
  {
    id: "2",
    title: "健康管理助手（数据库课设）",
    description: "基于 Flask 和 MySQL 的个人健康管理助手",
    tags: ["Flask", "MySQL", "Bootstrap", "JavaScript"],
    link: "https://github.com/kurrna/BUAA2025_DB",
    featured: false,
  },
  {
    id: "3",
    title: "常见算法与数据结构实现",
    description: "使用C++实现常见算法与数据结构，以加深理解",
    tags: ["C++", "算法", "数据结构"],
    link: "https://github.com/kurrna/algorithm",
    featured: false,
  },
];

export const POSTS: Post[] = [
  {
    id: "1",
    title: "编译器设计文档",
    date: "2026-01-03",
    // 使用根路径，确保在构建后可通过 /blogs/Compiler_设计文档.pdf 访问
    link: "/blogs/Compiler_设计文档.pdf",
  }
];

export const LINKS: Link[] = [
  { platform: "GitHub", url: "https://github.com/kurrna", iconName: "Github" }
];