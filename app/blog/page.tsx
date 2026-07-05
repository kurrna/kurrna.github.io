import Link from "next/link";
import {
  ArchiveIcon,
  ArrowRightIcon,
  BookOpenTextIcon,
  TagIcon,
} from "@phosphor-icons/react/dist/ssr";

import { BlogNav } from "@/components/blog-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog - Kurna",
  description: "Kurna 的学习笔记、项目复盘和随笔。",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BlogNav />
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12 focus:outline-none md:px-6 md:py-16"
      >
        <header className="flex flex-col gap-6 border-b pb-10">
          <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
            <BookOpenTextIcon />
            <span>BLOG / NOTES</span>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">博客</h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              学习笔记、项目复盘和随笔。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link href="/blog/category">
                <TagIcon data-icon="inline-start" />
                浏览分类
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/blog/archive">
                <ArchiveIcon data-icon="inline-start" />
                查看归档
              </Link>
            </Button>
          </div>
        </header>

        <section className="flex flex-col gap-4" aria-label="文章列表">
          {posts.map((post) => (
            <Card
              key={post.slug}
              className="rounded-md shadow-none transition-colors hover:bg-accent"
            >
              <CardHeader>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{post.category}</Badge>
                  <Badge variant="secondary" asChild>
                    <time dateTime={post.date}>{post.date}</time>
                  </Badge>
                  {post.lastUpdate !== post.date ? (
                    <span className="text-sm text-muted-foreground">
                      更新于 <time dateTime={post.lastUpdate}>{post.lastUpdate}</time>
                    </span>
                  ) : null}
                </div>
                <CardTitle asChild className="text-2xl">
                  <h2>{post.title}</h2>
                </CardTitle>
                <CardDescription>{post.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {post.tags.length ? (
                  <div className="flex flex-wrap gap-2" aria-label="文章标签">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                ) : null}
                <Button variant="ghost" className="min-h-11" asChild>
                  <Link href={`/blog/${post.slug}`} aria-label={`阅读《${post.title}》全文`}>
                    阅读全文
                    <ArrowRightIcon data-icon="inline-end" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
