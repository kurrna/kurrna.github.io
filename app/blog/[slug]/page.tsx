import Link from "next/link";
import { notFound } from "next/navigation";
import MarkdownRender from "markstream-react/next";

import { BlogNav } from "@/components/blog-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPostContent, getPosts } from "@/lib/posts";

export async function generateStaticParams() {
  const posts = await getPosts();

  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getPosts();
  const post = posts.find((item) => item.slug === slug);

  return {
    title: post ? `${post.title} - Kurna` : "Kurna",
    description: post?.description,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getPosts();
  const post = posts.find((item) => item.slug === slug);

  if (!post) notFound();

  const content = await getPostContent(post);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BlogNav />
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-10 focus:outline-none md:px-6 md:py-14"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button variant="ghost" className="min-h-11" asChild>
            <Link href="/blog">返回博客</Link>
          </Button>
          <div className="flex gap-2">
            <Badge variant="outline">{post.category}</Badge>
            <Badge variant="secondary" asChild>
              <time dateTime={post.date}>{post.date}</time>
            </Badge>
          </div>
        </div>
        <article
          aria-labelledby="post-title"
          className="rounded-md border bg-card p-5 text-card-foreground md:p-8"
        >
          <header className="mb-8 border-b pb-6">
            <h1
              id="post-title"
              className="font-heading text-3xl font-semibold tracking-tight md:text-4xl"
            >
              {post.title}
            </h1>
            <p className="mt-3 text-lg leading-8 text-muted-foreground">{post.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>
                最后更新： <time dateTime={post.lastUpdate}>{post.lastUpdate}</time>
              </span>
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" asChild>
                  <Link href="/blog/tag">#{tag}</Link>
                </Badge>
              ))}
            </div>
          </header>
          <MarkdownRender
            content={content}
            final
            fade={false}
            batchRendering={false}
            deferNodesUntilVisible={false}
            maxLiveNodes={0}
            renderCodeBlocksAsPre
          />
        </article>
      </main>
    </div>
  );
}
