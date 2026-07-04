"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  ArrowRightIcon,
  FileTextIcon,
  GithubLogoIcon,
  GlobeHemisphereWestIcon,
} from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { education, profile, projects } from "@/lib/site";

gsap.registerPlugin(useGSAP);

type HomePost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
};

export function HomePage({ posts }: { posts: HomePost[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-reveal]", {
          autoAlpha: 0,
          y: 18,
          duration: 0.65,
          ease: "power2.out",
          stagger: 0.06,
        });
      });

      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="min-h-screen bg-background text-foreground">
      <Header />
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <Projects />
        <Writing posts={posts} />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <nav
        aria-label="主导航"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6"
      >
        <a
          href="#about"
          className="inline-flex min-h-11 items-center font-heading text-lg font-semibold tracking-tight"
        >
          Kurna
        </a>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="min-h-11" asChild>
            <a href="#projects">项目</a>
          </Button>
          <Button variant="ghost" size="sm" className="min-h-11" asChild>
            <a href="#blog">博客</a>
          </Button>
          <Button variant="ghost" size="sm" className="min-h-11" asChild>
            <a href={`mailto:${profile.email}`}>联系</a>
          </Button>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  const [typingSvgColor, setTypingSvgColor] = useState("000000");

  useEffect(() => {
    function updateColor() {
      const isDark = document.documentElement.classList.contains("dark");
      setTypingSvgColor(isDark ? "FFFFFF" : "000000");
    }

    updateColor();

    const observer = new MutationObserver(updateColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-2 lg:items-center"
    >
      <div className="flex flex-col items-start gap-7">
        <div
          data-reveal
          className="flex items-center gap-3 text-base text-muted-foreground"
        >
          <span>BUAA / COMPUTER SCIENCE</span>
          <span aria-hidden="true">·</span>
          <span>BEIJING</span>
        </div>

        <div className="flex flex-col gap-5">
          <h1
            data-reveal
            className="font-heading text-5xl font-bold leading-none tracking-tight sm:text-5xl md:text-6xl"
          >
            {profile.name}
          </h1>
          <img
            src={`https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=500&size=40&duration=1000&pause=1000&color=${typingSvgColor}&multiline=true&repeat=false&width=700&height=150&lines=Hi+there%F0%9F%91%8B;I%E2%80%99m+Kurna%F0%9F%90%BB;So+glad+to+meet+you+here!%F0%9F%98%BA`}
            alt="Hi there! I’m Kurna. So glad to meet you here!"
            width={700}
            height={150}
          />
          <p
            data-reveal
            className="max-w-2xl text-xl leading-8 text-muted-foreground md:text-2xl"
          >
            努力提升计算机水平与工程能力中💪
          </p>
          {/*<p data-reveal className="max-w-xl text-lg leading-8 text-muted-foreground">
            {profile.bio}。
          </p>*/}
        </div>
        <div data-reveal className="flex flex-wrap gap-3">
          <Button size="lg" className="min-h-11 min-w-36" asChild>
            <a href={profile.github} target="_blank" rel="noreferrer">
              <GithubLogoIcon data-icon="inline-start" />
              GitHub
            </a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="min-h-11 min-w-36"
            asChild
          >
            <a href={profile.resume}>
              <FileTextIcon data-icon="inline-start" />
              简历
            </a>
          </Button>
        </div>
      </div>

      <ProfilePanel />
    </section>
  );
}

function ProfilePanel() {
  const details = [
    ["STATUS", "Undergraduate"],
    ["FOCUS", "Backend / Agent / Web"],
    ["EDUCATION", education.school],
    ["GPA", education.gpa],
    ["EMAIL", profile.email],
  ];

  return (
    <Card
      data-reveal
      className="gap-0 overflow-hidden rounded-md py-0 shadow-none"
    >
      <CardHeader className="py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardDescription className="font-mono">
              PROFILE / 2026.06
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-sm">
            Available for work
          </Badge>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        {details.map(([label, value], index) => (
          <div key={label}>
            <div className="grid grid-cols-1 gap-1 px-4 py-2.5 text-lg leading-7 sm:grid-cols-[auto_1fr] sm:gap-2">
              <span className="whitespace-nowrap font-mono text-base text-muted-foreground">
                {String(index + 1).padStart(2, "0")} / {label}
              </span>
              <span className="whitespace-nowrap text-left sm:text-right">
                {label === "EMAIL" ? (
                  <a
                    href={`mailto:${profile.email}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {value}
                  </a>
                ) : (
                  value
                )}
              </span>
            </div>
            {index < details.length - 1 ? <Separator /> : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function Projects() {
  return (
    <section id="projects" className="border-y bg-muted/30 py-16 md:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:px-6">
        <SectionHeading
          eyebrow="SELECTED WORK"
          title="项目经历"
          description="Java 后端与 Agent 开发"
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Card
              key={project.title}
              data-reveal
              className="h-full rounded-md bg-card shadow-none transition-colors hover:bg-accent"
            >
              <CardHeader>
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-base text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex gap-1">
                    {project.site ? (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="size-11"
                        asChild
                      >
                        <a
                          href={project.site}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${project.title} 网站`}
                        >
                          <GlobeHemisphereWestIcon />
                        </a>
                      </Button>
                    ) : null}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="size-11"
                      asChild
                    >
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${project.title} GitHub`}
                      >
                        <GithubLogoIcon />
                      </a>
                    </Button>
                  </div>
                </div>
                <CardTitle asChild className="text-xl">
                  <h3>{project.title}</h3>
                </CardTitle>
                <CardDescription className="leading-7 whitespace-pre-wrap">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <p className="font-mono text-sm leading-6 text-muted-foreground">
                  {project.tags.join(" · ")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Writing({ posts }: { posts: HomePost[] }) {
  return (
    <section
      id="blog"
      className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:px-6 md:py-20 lg:grid-cols-[0.7fr_1.3fr]"
    >
      <div>
        <SectionHeading
          eyebrow="RECENT BLOGS"
          title="近期博客"
          description="学习笔记与随笔"
        />
      </div>

      <div data-reveal className="flex flex-col border-t">
        {posts.slice(0, 3).map((post) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group grid gap-3 border-b py-4 transition-colors hover:bg-muted/50 sm:grid-cols-[7rem_1fr_auto] sm:items-center sm:px-3"
          >
            <time
              dateTime={post.date}
              className="font-mono text-sm text-muted-foreground"
            >
              {post.date}
            </time>
            <div className="min-w-0">
              <h3 className="font-heading text-xl font-medium">{post.title}</h3>
              <p className="mt-1 line-clamp-1 text-base leading-6 text-muted-foreground">
                {post.description}
              </p>
            </div>
            <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
          </a>
        ))}
        <Button variant="ghost" className="mt-4 min-h-11 self-start" asChild>
          <a href="/blog">
            查看全部博客
            <ArrowRightIcon data-icon="inline-end" />
          </a>
        </Button>
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div data-reveal className="flex max-w-xl flex-col gap-3">
      <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
      <p className="text-lg leading-8 text-muted-foreground">{description}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-base text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-6">
        <span>
          © {new Date().getFullYear()}{" "}
          <a
            href={`https://github.com/kurrna`}
            className="transition-colors hover:text-foreground"
          >
            {profile.name}
          </a>
        </span>
        <a
          href={`mailto:${profile.email}`}
          className="transition-colors hover:text-foreground"
        >
          {profile.email}
        </a>
      </div>
    </footer>
  );
}
