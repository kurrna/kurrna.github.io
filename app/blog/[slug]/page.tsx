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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = await getPosts();
  const post = posts.find((item) => item.slug === slug);

  return {
    title: post ? `${post.title} - Kurna` : "Kurna",
    description: post?.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = await getPosts();
  const post = posts.find((item) => item.slug === slug);

  if (!post) notFound();

  const content = await getPostContent(post);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BlogNav />
      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-10 md:px-6 md:py-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button variant="ghost" asChild>
            <Link href="/blog">返回博客</Link>
          </Button>
          <div className="flex gap-2">
            <Badge variant="outline">{post.category}</Badge>
            <Badge variant="secondary">{post.date}</Badge>
          </div>
        </div>
        <article className="rounded-md border bg-card p-5 text-card-foreground md:p-8">
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
