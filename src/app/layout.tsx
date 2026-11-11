
import type { Metadata } from "next";
import "./globals.css";
import ServiceWorkerRegister from "@/components/pwa/service-worker-register";
const siteUrl = 'https://opentap.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "The Open Tab | Ideas, Tools & Perspectives",
    template: "%s | The Open Tab",
  },

  description:
    "Discover ideas, technology, AI, business, programming, productivity and perspectives for a changing world.",

  applicationName: "The Open Tab",

  keywords: [
    "The Open Tab",
    "Technology",
    "Artificial Intelligence",
    "Business",
    "Programming",
    "Digital Skills",
    "Personal Development",
    "Digital Lifestyle",
  ],

  openGraph: {
    title: "The Open Tab | Ideas, Tools & Perspectives",
    description:
      "Ideas, tools and perspectives for a changing world.",
    siteName: "The Open Tab",
    type: "website",
    locale: "en_US",
    url: "/",
  },

  twitter: {
    card: "summary_large_image",
    title: "The Open Tab | Ideas, Tools & Perspectives",
    description:
      "Ideas, tools and perspectives for a changing world.",
  },

  robots: {
    index: true,
    follow: true,
  },

  appleWebApp: {
  capable: true,
  statusBarStyle: "black-translucent",
  title: "Open Tab",
},

icons: {
  icon: [
    {
      url: "/icons/icon-192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      url: "/icons/icon-512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
  apple: "/icons/icon-192.png",
},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
         <ServiceWorkerRegister />
        {children}
        </body>
    </html>
  );
}
