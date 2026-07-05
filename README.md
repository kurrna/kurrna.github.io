# Kurna's Homepage

基于 Next.js App Router、TypeScript、Tailwind CSS 和 shadcn/ui 构建的个人主页与 Markdown 博客，使用静态导出部署至 GitHub Pages。

## 本地开发

环境要求：

- Node.js 20+
- pnpm 11

```bash
pnpm install
pnpm dev
```

访问 <http://localhost:3000>。

## 常用命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建并静态导出
pnpm lint         # ESLint 检查
pnpm lint:fix     # 自动修复可修复问题
pnpm typecheck    # TypeScript 类型检查
pnpm format       # Prettier 格式化
pnpm format:check # 检查格式
pnpm check        # 依次执行 lint、typecheck 和格式检查
```

## 博客

Markdown 文件位于 `public/blogs`，frontmatter 示例：

```yaml
---
title: Agent Learning
description: Agent 学习笔记
date: 2026-06-27
last_update: 2026-07-05
tags: [Agent, RAG]
category: 学习笔记
---
```

博客路由统一使用单数：

- `/blog`
- `/blog/category`
- `/blog/tag`
- `/blog/archive`

## 项目结构

```text
app/            Next.js 页面与全局样式
components/     页面组件与 shadcn/ui 基础组件
lib/            博客解析和站点数据
public/blogs/   Markdown 博客
```

提交前运行：

```bash
pnpm check
pnpm build
```

Agent 协作规范见 [AGENTS.md](./AGENTS.md)。
