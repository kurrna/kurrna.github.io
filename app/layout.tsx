import type { Metadata } from "next";
import { JetBrains_Mono, Noto_Sans_SC } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "katex/dist/katex.min.css";
import "markstream-react/index.css";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto-sans-sc",
});

export const metadata: Metadata = {
  title: "Kurna's Homepage",
  description: "你好，我是 Kurna",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${jetbrainsMono.variable} ${notoSansSC.variable} scroll-smooth`}
    >
      <body>
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-20 rounded-md bg-background px-4 py-3 text-foreground shadow-md focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          跳转到主要内容
        </a>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
