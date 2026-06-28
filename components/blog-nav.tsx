import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function BlogNav() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="font-heading text-lg font-semibold tracking-tight">
          Kurna
        </Link>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blog">文章</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blog/category">分类</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blog/archive">归档</Link>
          </Button>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
