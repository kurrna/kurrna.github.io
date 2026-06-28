import { HomePage } from "@/components/home-page";
import { getPosts } from "@/lib/posts";

export default async function Page() {
  const posts = await getPosts();

  return <HomePage posts={posts.map(({ filePath, ...post }) => post)} />;
}
