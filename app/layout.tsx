import AuthProvider from "@/components/AuthProvider";
import FooterPage from "@/components/Share/FooterPage";
import HeaderNavBar from "@/components/Share/HeaderNavBar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
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
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"
      ></Script>
      <Script async src="https://kit.fontawesome.com/6310d1a086.js"></Script>
      <body
        className={`${inter.className}`}
        style={{ height: "calc(100% - 65px)" }}
      >
        <UIProvider>
          <AuthProvider session={Session}>
            <HeaderNavBar />
            {children}
            <FooterPage />
          </AuthProvider>
        </UIProvider>
      </body>
    </html>
  );
}
