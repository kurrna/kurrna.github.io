"use client";

import { FormEvent, useRef, useState } from "react";
import MarkdownRender from "markstream-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowRightIcon,
  BookOpenTextIcon,
  ChatCircleDotsIcon,
  FileTextIcon,
  GithubLogoIcon,
  GlobeHemisphereWestIcon,
  PaperPlaneTiltIcon,
  SparkleIcon,
  XIcon,
} from "@phosphor-icons/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { education, profile, projects, skills } from "@/lib/site";
import { cn } from "@/lib/utils";
import { sendMessageToDeepSeek } from "@/services/deepseekService";

gsap.registerPlugin(useGSAP);

type Message = {
  role: "user" | "assistant";
  content: string;
};

type HomePost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
};

const sampleAssistant = `可以问我这些：

- Kurna 的项目经历
- 技术栈和学习方向
- 如何联系本人`;

export function HomePage({
  posts,
  blogPreview,
}: {
  posts: HomePost[];
  blogPreview: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-animate]", {
          autoAlpha: 0,
          y: 14,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.04,
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero postCount={posts.length} />
        <Projects />
        <Study />
        <Writing posts={posts} blogPreview={blogPreview} />
      </main>
      <Footer />
      <FloatingChat />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <nav className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4 md:px-6">
        <a href="#home" className="font-heading text-base font-medium">
          Kurna
        </a>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <a href="#projects">项目</a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="/blog">博客</a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href={`mailto:${profile.email}`}>联系</a>
          </Button>
        </div>
      </nav>
    </header>
  );
}

function Hero({ postCount }: { postCount: number }) {
  return (
    <section id="home" className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-[1fr_20rem] md:px-6">
      <div className="flex flex-col gap-5">
        <div data-animate className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">BUAA 2023 CS</Badge>
          <Badge variant="outline">Java / Agent / Web</Badge>
        </div>

        <div className="flex flex-col gap-4">
          <h1 data-animate className="text-6xl font-medium leading-none tracking-normal md:text-8xl">
            {profile.name}
          </h1>
          <p data-animate className="max-w-2xl text-xl leading-8 text-muted-foreground">
            {profile.role}，在 {profile.location}。{profile.bio}
          </p>
        </div>

        <div data-animate className="flex flex-wrap gap-2">
          <Button asChild>
            <a href={profile.resume}>
              <FileTextIcon data-icon="inline-start" />
              简历
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={profile.github} target="_blank" rel="noreferrer">
              <GithubLogoIcon data-icon="inline-start" />
              GitHub
            </a>
          </Button>
          <Button variant="ghost" asChild>
            <a href="/blog">
              博客
              <ArrowRightIcon data-icon="inline-end" />
            </a>
          </Button>
        </div>
      </div>

      <aside data-animate className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="size-20">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback>KU</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-base text-muted-foreground">{profile.email}</p>
            <p className="text-sm text-muted-foreground">{education.school}</p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-2 text-sm">
          <Stat value={String(projects.length)} label="Projects" />
          <Stat value={String(postCount)} label="Posts" />
          <Stat value={String(skills.length)} label="Stack" />
          <Stat value="2023" label="BUAA" />
        </div>
      </aside>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="font-heading text-2xl font-medium">{value}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}

function Projects() {
  return (
    <section id="projects" className="bg-muted/35 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 md:px-6">
        <SectionHeading eyebrow="Projects" title="项目" />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.title} data-animate className="rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <CardDescription className="leading-6">{project.description}</CardDescription>
                <CardAction className="flex gap-1">
                  {project.site ? (
                    <Button variant="ghost" size="icon-sm" asChild>
                      <a href={project.site} target="_blank" rel="noreferrer" aria-label={`${project.title} 网站`}>
                        <GlobeHemisphereWestIcon />
                      </a>
                    </Button>
                  ) : null}
                  <Button variant="ghost" size="icon-sm" asChild>
                    <a href={project.href} target="_blank" rel="noreferrer" aria-label={`${project.title} GitHub`}>
                      <GithubLogoIcon />
                    </a>
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Study() {
  return (
    <section className="py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 md:grid-cols-[0.8fr_1.2fr] md:px-6">
        <SectionHeading eyebrow="Now" title="学习轨迹" />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Card data-animate className="rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg">{education.title}</CardTitle>
              <CardDescription>{education.school}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="leading-7 text-muted-foreground">{education.description}</p>
              <Badge variant="secondary">{education.period}</Badge>
            </CardContent>
          </Card>

          <Card data-animate className="rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg">技术栈</CardTitle>
              <CardDescription>目前最常用和正在补齐的工具。</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Writing({
  posts,
  blogPreview,
}: {
  posts: HomePost[];
  blogPreview: string;
}) {
  return (
    <section className="bg-muted/35 py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 md:grid-cols-[0.9fr_1.1fr] md:px-6">
        <div className="flex flex-col gap-4">
          <SectionHeading eyebrow="Writing" title="近期文章" />
          <div className="flex flex-col gap-2">
            {posts.slice(0, 3).map((post) => (
              <a
                key={post.slug}
                data-animate
                href={`/blog/${post.slug}`}
                className="group rounded-lg border bg-card p-4 transition-colors hover:bg-muted"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-medium">{post.title}</h3>
                  <Badge variant="outline">{post.category}</Badge>
                </div>
                <p className="mt-2 line-clamp-2 leading-6 text-muted-foreground">{post.description}</p>
                <p className="mt-3 text-sm text-muted-foreground">{post.date}</p>
              </a>
            ))}
          </div>
          <Button variant="outline" asChild>
            <a href="/blog">
              进入博客
              <ArrowRightIcon data-icon="inline-end" />
            </a>
          </Button>
        </div>

        <Card data-animate className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg">Markdown 预览</CardTitle>
            <CardDescription>博客详情和 AI 回复都使用 markstream-react 渲染。</CardDescription>
          </CardHeader>
          <CardContent className="text-base">
            <MarkdownRender content={blogPreview} final fade={false} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end gap-3">
      {isOpen ? <ChatPanel onClose={() => setIsOpen(false)} /> : null}
      <Button
        aria-label={isOpen ? "关闭 AI 问答" : "打开 AI 问答"}
        className="size-14 rounded-full shadow-lg"
        size="icon"
        onClick={() => setIsOpen((value) => !value)}
      >
        {isOpen ? <XIcon /> : <ChatCircleDotsIcon />}
      </Button>
    </div>
  );
}

function ChatPanel({ onClose }: { onClose: () => void }) {
  const [apiKey, setApiKey] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: sampleAssistant },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = input.trim();
    if (!content || !apiKey.trim() || isLoading) return;

    const nextMessages = [...messages, { role: "user" as const, content }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const answer = await sendMessageToDeepSeek(apiKey.trim(), content, messages);
      setMessages([...nextMessages, { role: "assistant", content: answer || "我暂时没有拿到有效回答。" }]);
    } catch {
      setMessages([...nextMessages, { role: "assistant", content: "请求失败了。请检查 API Key 或稍后再试。" }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-[calc(100vw-2rem)] max-w-md rounded-lg shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-3 text-lg">
          <span className="flex items-center gap-2">
            <ChatCircleDotsIcon />
            AI 问答
          </span>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="关闭 AI 问答">
            <XIcon />
          </Button>
        </CardTitle>
        <CardDescription>回答只基于主页信息。API Key 仅保存在当前页面状态里。</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <form onSubmit={(event) => event.preventDefault()}>
          <Input
            type="password"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder="DeepSeek API Key"
            aria-label="DeepSeek API Key"
            autoComplete="off"
          />
        </form>

        <ScrollArea className="h-72 rounded-lg border bg-background">
          <div className="flex flex-col gap-3 p-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={cn(
                  "max-w-[92%] rounded-lg border p-3 text-sm leading-6",
                  message.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "mr-auto bg-card"
                )}
              >
                {message.role === "assistant" ? (
                  <MarkdownRender content={message.content} final fade={false} />
                ) : (
                  message.content
                )}
              </div>
            ))}
            {isLoading ? (
              <div className="mr-auto inline-flex items-center gap-2 rounded-lg border bg-card p-3 text-sm text-muted-foreground">
                <SparkleIcon />
                生成中
              </div>
            ) : null}
          </div>
        </ScrollArea>

        <form onSubmit={onSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="问一个关于 Kurna 的问题"
            aria-label="问题"
            disabled={isLoading}
          />
          <Button type="submit" disabled={!input.trim() || !apiKey.trim() || isLoading}>
            <PaperPlaneTiltIcon data-icon="inline-start" />
            发送
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div data-animate className="flex flex-col gap-1">
      <p className="text-sm text-muted-foreground">{eyebrow}</p>
      <h2 className="text-3xl font-medium tracking-normal">{title}</h2>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <a href={`mailto:${profile.email}`} className="hover:text-foreground">
          {profile.email}
        </a>
      </div>
    </footer>
  );
}
