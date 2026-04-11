import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevAligns — Build Beyond Tomorrow | Premium Digital Agency",
  description: "DevAligns is a cutting-edge digital agency focused on building powerful, scalable, and modern digital experiences that elevate brands into the future.",
  keywords: "digital agency, web development, UI/UX design, branding, AI solutions, digital marketing",
  icons: {
    icon: "/devaligns-logo.png",
    apple: "/devaligns-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
