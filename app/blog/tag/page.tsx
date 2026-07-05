import Link from "next/link";
import { TagIcon } from "@phosphor-icons/react/dist/ssr";

import { BlogNav } from "@/components/blog-nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPosts } from "@/lib/posts";

export const metadata = {
  title: "标签 - Kurna",
  description: "按标签浏览 Kurna 的博客文章。",
};

export default async function BlogTagsPage() {
  const posts = await getPosts();
  const tags = Array.from(
    posts.reduce((map, post) => {
      post.tags.forEach((tag) => map.set(tag, [...(map.get(tag) ?? []), post]));
      return map;
    }, new Map<string, typeof posts>()),
  ).sort(
    ([a, aPosts], [b, bPosts]) => bPosts.length - aPosts.length || a.localeCompare(b, "zh-CN"),
  );
  const maxCount = Math.max(...tags.map(([, tagPosts]) => tagPosts.length), 1);

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
            <TagIcon aria-hidden="true" />
            <span>BLOG / TAGS</span>
          </div>
          <h1 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">标签</h1>
          <p className="text-lg leading-8 text-muted-foreground">按主题关键词浏览全部文章。</p>
        </header>

        <section aria-labelledby="tag-cloud-title">
          <h2 id="tag-cloud-title" className="sr-only">
            标签云
          </h2>
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-4">
            {tags.map(([tag, tagPosts], index) => (
              <Link
                key={tag}
                href={`#tag-${index + 1}`}
                className="font-heading font-medium text-foreground underline-offset-4 hover:underline"
                style={{ fontSize: `${1 + (tagPosts.length / maxCount) * 1.25}rem` }}
                aria-label={`${tag}，${tagPosts.length} 篇文章`}
              >
                {tag}
                <sup className="ml-1 text-sm text-muted-foreground">{tagPosts.length}</sup>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2" aria-label="各标签文章">
          {tags.map(([tag, tagPosts], index) => (
            <Card key={tag} id={`tag-${index + 1}`} className="rounded-md shadow-none">
              <CardHeader>
                <CardTitle asChild className="text-2xl">
                  <h2>#{tag}</h2>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-1">
                {tagPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="grid gap-1 rounded-md px-3 py-3 transition-colors hover:bg-muted"
                  >
                    <span className="font-medium">{post.title}</span>
                    <span className="flex flex-wrap items-center gap-2">
                      <time
                        dateTime={post.lastUpdate}
                        className="font-mono text-sm text-muted-foreground"
                      >
                        {post.lastUpdate}
                      </time>
                      <Badge variant="outline">{post.category}</Badge>
                    </span>
                  </Link>
                ))}
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
