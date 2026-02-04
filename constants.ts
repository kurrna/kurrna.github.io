import { Experience, Post, Project, Link } from './types';

export const PROFILE = {
  name: "kurna",
  role: "本科计算机专业在读",
  bio: "正在学习前端开发的学生",
  location: "北京海淀",
  email: "kurna@foxmail.com",
};

export const SKILLS = [
  "C/C++", "Python", "Java", "JavaScript", "HTML", "CSS", "Git", "SQL"
];

export const EXPERIENCE: Experience[] = [
  {
    id: "1",
    role: "本科计算机专业在读",
    company: "BUAA",
    period: "2023.09 - 至今",
    description: "GPA 3.6/4.0",
    skills: ["计算机组成原理", "操作系统", "编译原理", "数据结构与算法"],
  }
];

export const PROJECTS: Project[] = [
  {
    id: "1",
    title: "健康管理助手",
    description: "基于 Flask 和 MySQL 的个人健康管理助手",
    tags: ["Flask", "MySQL", "Bootstrap", "JavaScript"],
    link: "https://github.com/kurrna/",
    stars: 0,
    featured: true,
  }
];

export const POSTS: Post[] = [
  
];

export const LINKS: Link[] = [
  { platform: "GitHub", url: "https://github.com/kurrna", iconName: "Github" }
];