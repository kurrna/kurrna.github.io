import Link from "next/link";
import {
  ArchiveIcon,
  ArrowRightIcon,
  BookOpenTextIcon,
  TagIcon,
} from "@phosphor-icons/react/dist/ssr";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { categories, getPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog - Kurna",
  description: "Kurna 的文章归档和分类。",
};

export default async function BlogPage() {
  const posts = await getPosts();
  const years = Array.from(new Set(posts.map((post) => post.date.slice(0, 4))));

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-8 md:px-6">
      <header className="flex flex-col gap-4">
        <Button variant="ghost" className="w-fit" asChild>
          <Link href="/">返回首页</Link>
        </Button>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpenTextIcon />
            <span>Blog</span>
          </div>
          <h1 className="text-5xl font-medium tracking-normal md:text-6xl">文章</h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            学习笔记、项目复盘和随笔会都放在这里，按归档和分类快速扫一遍。
          </p>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-[16rem_1fr]">
        <aside className="flex flex-col gap-4">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TagIcon />
                分类
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 md:flex-col">
              {categories.map((category) => (
                <a key={category} href={`#category-${category}`}>
                  <Badge variant="outline">
                    {category} · {posts.filter((post) => post.category === category).length}
                  </Badge>
                </a>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ArchiveIcon />
                Archive
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 md:flex-col">
              {years.map((year) => (
                <a key={year} href={`#archive-${year}`}>
                  <Badge variant="secondary">
                    {year} · {posts.filter((post) => post.date.startsWith(year)).length}
                  </Badge>
                </a>
              ))}
            </CardContent>
          </Card>
        </aside>

        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-lg border bg-card p-4 transition-colors hover:bg-muted"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-2xl font-medium tracking-normal">{post.title}</h2>
                  <div className="flex gap-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <Badge variant="secondary">{post.date}</Badge>
                  </div>
                </div>
                <p className="mt-2 leading-7 text-muted-foreground">{post.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-muted-foreground group-hover:text-foreground">
                  阅读
                  <ArrowRightIcon />
                </span>
              </Link>
            ))}
          </section>

          <Separator />

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {categories.map((category) => (
              <Card key={category} id={`category-${category}`} className="rounded-lg">
                <CardHeader>
                  <CardTitle>{category}</CardTitle>
                  <CardDescription>
                    {posts.filter((post) => post.category === category).length} 篇文章
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {posts.filter((post) => post.category === category).map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="text-sm hover:underline">
                      {post.date} · {post.title}
                    </Link>
                  ))}
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-3xl font-medium tracking-normal">Archive</h2>
            {years.map((year) => (
              <div key={year} id={`archive-${year}`} className="flex flex-col gap-2">
                <h3 className="text-xl font-medium">{year}</h3>
                {posts.filter((post) => post.date.startsWith(year)).map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="text-muted-foreground hover:text-foreground">
                    {post.date.slice(5)} · {post.title}
                  </Link>
                ))}
              </div>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
