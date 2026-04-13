import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import "./globals.scss";

export const metadata: Metadata = {
  title: "台北景點探索",
  description: "探索台北旅遊景點，收藏你的最愛",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
