import { HomePage } from "@/components/home-page";
import { getPostContent, getPosts } from "@/lib/posts";

export default async function Page() {
  const posts = await getPosts();
  const preview = posts[0] ? await getPostContent(posts[0]) : "# 暂无文章";

  return <HomePage posts={posts.map(({ filePath, ...post }) => post)} blogPreview={preview} />;
}
