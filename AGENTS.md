# AI 开发规范

本文件适用于在本仓库工作的 Coding Agent。

## 基本原则

- 先阅读相关代码并确认真实调用链，再修改。
- 保持改动最小，复用现有组件、工具和设计 token。
- 不为单一场景增加抽象，不引入没有明确必要性的依赖。
- 保留用户已有的未提交改动；禁止使用 `git reset --hard`、`git checkout --` 等破坏性命令。
- 未经明确要求，不提交、推送、创建分支或修改部署配置。

## 技术约束

- 使用 pnpm，不使用 npm 或 yarn。
- 使用 Next.js App Router、React、TypeScript strict mode 和 Tailwind CSS。
- 默认使用 Server Component；仅在需要状态、事件或浏览器 API 时添加 `"use client"`。
- 内部导航使用 `next/link`，外部链接使用标准 `<a>` 并补充必要的 `rel`。
- 优先使用现有 shadcn/ui 组件；不要直接修改生成组件，除非修改能解决所有调用方的共同问题。
- 不使用 `any` 绕过类型检查，不使用无理由的 ESLint 禁用注释。
- 路由集合保持单数形式：`/blog`、`/blog/category`、`/blog/tag`、`/blog/archive`。

## UI 与无障碍

- 同时检查浅色、深色和移动端布局。
- 页面必须有唯一 `h1`、语义化标题层级、可访问的导航名称和跳转正文链接。
- 交互控件必须支持键盘操作、可见焦点和明确的可访问名称。
- 非行内触控目标至少为 44×44 CSS px。
- 正文文本满足 WCAG AA 对比度；不能仅依赖颜色传递信息。
- 动画必须尊重 `prefers-reduced-motion`。

## 博客内容

- Markdown 放在 `public/blogs`。
- frontmatter 支持 `title`、`description`、`date`、`last_update`、`tags` 和 `category`。
- `date` 与 `last_update` 使用 ISO 日期格式 `YYYY-MM-DD`。
- `tags` 使用数组形式，例如 `tags: [Spring, Java]`。
- 修改渲染逻辑后，至少检查长文、代码块、表格和 LaTeX。

## 代码质量

- 遵循 `eslint.config.mjs` 与 `.prettierrc.json`。
- 不编辑 `.next`、`out`、`next-env.d.ts` 等生成文件。
- 完成修改后运行与改动相称的检查：

```bash
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
```

- 路由、构建配置、Markdown 解析或依赖变更必须运行 `pnpm build`。
- 若检查失败，说明失败原因；不要隐藏或删除已有错误。

## Git

- 提交应按功能拆分，提交信息使用明确的祈使句。
- 暂存前检查 `git diff`，避免混入用户文件或无关格式化。
- 不提交密钥、`.env.local`、构建产物或临时文件。
