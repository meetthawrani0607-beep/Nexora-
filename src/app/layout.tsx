import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevAligns — Build Beyond Tomorrow | Premium Digital Agency",
  description: "DevAligns is a cutting-edge digital agency focused on building powerful, scalable, and modern digital experiences that elevate brands into the future.",
  keywords: "digital agency, web development, UI/UX design, branding, AI solutions, digital marketing, DevAligns",
  authors: [{ name: "DevAligns" }],
  creator: "DevAligns",
  metadataBase: new URL("https://devaligns.com"),
  openGraph: {
    title: "DevAligns — Build Beyond Tomorrow",
    description: "We craft powerful digital experiences that elevate brands into the future — blending design, technology, and strategy into one seamless force.",
    url: "https://devaligns.com",
    siteName: "DevAligns",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevAligns — Build Beyond Tomorrow",
    description: "Premium digital agency crafting scalable web apps, branding, AI solutions & more.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.png",
    apple: "/devaligns-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
