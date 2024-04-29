import AuthProvider from "@/components/AuthProvider";
import HeaderNavBar from "@/components/HeaderNavBar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import UIProvider from "./(client)/_lib/UIProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IA Store",
  description: "Ecommerce website develop by huyprowow",
  authors: [{ name: "huyprowow", url: "https://huyprowow.github.io" }],
  keywords: ["Ecommerce", "huyprowow", "IA", "Bùi Quang Huy"],
};

export default function RootLayout({
  children,
  Session,
}: Readonly<{
  children: React.ReactNode;
  Session: any;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} h-screen`}>
        <UIProvider>
          <AuthProvider session={Session}>
            <HeaderNavBar />
            {children}
          </AuthProvider>
        </UIProvider>
      </body>
    </html>
  );
}
