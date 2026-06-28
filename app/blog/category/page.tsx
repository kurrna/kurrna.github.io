import Link from "next/link";
import { TagIcon } from "@phosphor-icons/react/dist/ssr";

import { BlogNav } from "@/components/blog-nav";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { categories, getPosts } from "@/lib/posts";

export const metadata = {
  title: "分类 - Kurna",
  description: "按主题浏览 Kurna 的博客文章。",
};

export default async function BlogCategoryPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BlogNav />
      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12 md:px-6 md:py-16">
        <header className="flex flex-col gap-3 border-b pb-8">
          <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
            <TagIcon />
            <span>BLOG / CATEGORY</span>
          </div>
          <h1 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">分类</h1>
          <p className="text-lg leading-8 text-muted-foreground">按主题浏览全部文章。</p>
        </header>

        <section className="grid gap-5 md:grid-cols-2">
          {categories.map((category) => {
            const categoryPosts = posts.filter((post) => post.category === category);

            return (
              <Card key={category} id={category} className="rounded-md shadow-none">
                <CardHeader>
                  <CardTitle className="text-2xl">{category}</CardTitle>
                  <CardDescription>{categoryPosts.length} 篇文章</CardDescription>
                  <CardAction>
                    <Badge variant="outline">{String(categoryPosts.length).padStart(2, "0")}</Badge>
                  </CardAction>
                </CardHeader>
                <CardContent className="flex flex-col gap-1">
                  {categoryPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="grid gap-1 rounded-md px-3 py-3 transition-colors hover:bg-muted"
                    >
                      <span className="font-medium">{post.title}</span>
                      <time className="font-mono text-sm text-muted-foreground">{post.date}</time>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </section>
      </main>
    </div>
  );
}
