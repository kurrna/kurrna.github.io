"use client";

import dynamic from "next/dynamic";

const MarkdownRender = dynamic(
  () => import("markstream-react/next").then((mod) => mod.default),
  { ssr: false },
);

export default function MarkdownRenderClient({
  content,
}: {
  content: string;
}) {
  return (
    <MarkdownRender
      content={content}
      final
      fade={false}
      batchRendering={false}
      deferNodesUntilVisible={false}
      maxLiveNodes={0}
    />
  );
}
