import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const mainFont = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Polling Apps",
  description: "Create, send and manage polls",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>

        </head>
      <body
        className={`${mainFont.variable} antialiased light`}
      >
        {children}

      </body>
    </html>
  );
}
