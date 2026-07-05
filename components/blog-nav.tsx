import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function BlogNav() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <nav
        aria-label="博客导航"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between px-2 sm:px-4 md:px-6"
      >
        <Link
          href="/"
          className="inline-flex min-h-11 min-w-11 items-center justify-center font-heading text-lg font-semibold tracking-tight"
        >
          <span className="sm:hidden">K</span>
          <span className="hidden sm:inline">Kurna</span>
        </Link>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="min-h-11 px-2 sm:px-2.5" asChild>
            <Link href="/blog">文章</Link>
          </Button>
          <Button variant="ghost" size="sm" className="min-h-11 px-2 sm:px-2.5" asChild>
            <Link href="/blog/category">分类</Link>
          </Button>
          <Button variant="ghost" size="sm" className="min-h-11 px-2 sm:px-2.5" asChild>
            <Link href="/blog/tag">标签</Link>
          </Button>
          <Button variant="ghost" size="sm" className="min-h-11 px-2 sm:px-2.5" asChild>
            <Link href="/blog/archive">归档</Link>
          </Button>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
