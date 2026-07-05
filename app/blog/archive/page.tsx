import Link from "next/link";
import { ArchiveIcon } from "@phosphor-icons/react/dist/ssr";

import { BlogNav } from "@/components/blog-nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPosts } from "@/lib/posts";

export const metadata = {
  title: "归档 - Kurna",
  description: "按时间浏览 Kurna 的博客文章。",
};

export default async function BlogArchivePage() {
  const posts = await getPosts();
  const years = Array.from(new Set(posts.map((post) => post.date.slice(0, 4))));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BlogNav />
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12 focus:outline-none md:px-6 md:py-16"
      >
        <header className="flex flex-col gap-3 border-b pb-8">
          <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
            <ArchiveIcon />
            <span>BLOG / ARCHIVE</span>
          </div>
          <h1 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">归档</h1>
          <p className="text-lg leading-8 text-muted-foreground">按发布时间浏览全部文章。</p>
        </header>

        <section className="flex flex-col gap-6">
          {years.map((year) => {
            const yearPosts = posts.filter((post) => post.date.startsWith(year));

            return (
              <Card key={year} className="gap-0 rounded-md py-0 shadow-none">
                <CardHeader className="py-5">
                  <CardTitle asChild className="text-3xl">
                    <h2>{year}</h2>
                  </CardTitle>
                  <CardDescription>{yearPosts.length} 篇文章</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {yearPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="grid gap-3 border-t px-6 py-4 transition-colors hover:bg-muted sm:grid-cols-[5rem_1fr_auto] sm:items-center"
                    >
                      <time
                        dateTime={post.date}
                        className="font-mono text-sm text-muted-foreground"
                      >
                        {post.date.slice(5)}
                      </time>
                      <span className="font-medium">{post.title}</span>
                      <Badge variant="outline">{post.category}</Badge>
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
