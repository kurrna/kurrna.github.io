export const profile = {
  name: "Kurna",
  role: "CS Undergraduate of Beihang University",
  bio: "正在学习 Agent 和 Java 后端开发",
  location: "北京海淀",
  email: "kurna2026@outlook.com",
  github: "https://github.com/kurrna",
  resume: "/public.pdf",
  avatar: "https://github.com/kurrna.png",
};

export const skills = ["Java", "Python", "Spring", "Redis"];

export const projects = [
  {
    title: "TimeCampus 时光航迹地图",
    site: "https://www.timecampus.asia",
    description:
      "一个基于 Spring Boot、React 的时光胶囊地图 Web 全栈应用，集成了游客导览与后台运营智能体，与北航校史馆合作展示。",
    tags: ["Spring Boot", "LangGraph", "Spring AI", "React", "Redis", "MySQL"],
    href: "https://github.com/BUAA2026SE-404NotFound/TimeCampus",
  },
  {
    title: "TimeCampus-Agent",
    description:
      "时光航迹项目的智能体模块，基于 LangGraph 和时光航迹后端的 Spring AI MCP Server，支持RAG、知识图谱问答、智能体任务执行等功能。",
    tags: ["LangGraph", "Python", "Spring AI", "RAG", "Agent", "Qdrant"],
    href: "https://github.com/BUAA2026SE-404NotFound/TimeCampus-Agent",
  },
  {
    title: "Tsuki Framework",
    description:
      "仿照 Spring 框架设计的一个轻量级 Java Web 框架，支持依赖注入、AOP、JDBC 和 MVC。",
    tags: ["Java", "Spring", "MVC", "AOP", "JDBC"],
    href: "https://github.com/kurrna/tsuki-framework",
  },
];

export const education = {
  title: "Undergraduate",
  school: "北京航空航天大学 计算机学院",
  period: "2023.09 - 至今",
  gpa: "3.6/4.0",
  projects: ["数据结构与算法", "操作系统", "计算机网络", "编译原理", "软件工程", "..."],
};
