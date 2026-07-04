import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  filePath: string;
};

const blogDir = path.join(process.cwd(), "public", "blogs");
export const categories = ["学习笔记", "随笔", "项目复盘"];

export async function getPosts() {
  const files = await readdir(blogDir);
  const markdownFiles = files.filter((file) => file.toLowerCase().endsWith(".md"));
  const posts = await Promise.all(markdownFiles.map(readPostMeta));

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPostContent(post: Pick<BlogPost, "filePath">) {
  const content = await readFile(post.filePath, "utf8");

  return stripFrontmatter(content).replace(/^\s*#\s+.*(?:\r?\n|$)/, "");
}

async function readPostMeta(file: string): Promise<BlogPost> {
  const filePath = path.join(blogDir, file);
  const content = await readFile(filePath, "utf8");
  const meta = parseFrontmatter(content);
  const body = stripFrontmatter(content);
  const lines = body.split(/\r?\n/).map((line) => line.trim());
  const title = meta.title || lines.find((line) => line.startsWith("# "))?.replace(/^#\s+/, "") || path.basename(file, ".md");
  const description =
    meta.description ||
    lines.find((line) => line && !line.startsWith("#") && !line.startsWith("|") && !line.startsWith("-")) ||
    "Markdown 博客";
  const slug = path.basename(file, ".md").toLowerCase().replace(/\s+/g, "-");

  return {
    slug,
    title,
    description,
    date: meta.date || "2026-01-01",
    category: meta.category || "学习笔记",
    filePath,
  };
}

function parseFrontmatter(content: string) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!match) return {} as Record<string, string>;

  return Object.fromEntries(
    match[1].split(/\r?\n/).map((line) => {
      const [key, ...rest] = line.split(":");
      return [key.trim(), rest.join(":").trim()];
    })
  );
}

function stripFrontmatter(content: string) {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
}
