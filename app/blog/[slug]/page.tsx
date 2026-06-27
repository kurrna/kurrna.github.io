import Link from "next/link";
import { notFound } from "next/navigation";
import MarkdownRender from "markstream-react/next";

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
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-4 py-10 md:px-6">
      <div className="flex items-center justify-between gap-4">
        <Button variant="ghost" asChild>
          <Link href="/blog">返回博客</Link>
        </Button>
        <span className="text-sm text-muted-foreground">{post.category} / {post.date}</span>
      </div>
      <article className="rounded-lg border bg-card p-5 text-card-foreground md:p-8">
        <MarkdownRender content={content} final />
      </article>
    </main>
  );
}
