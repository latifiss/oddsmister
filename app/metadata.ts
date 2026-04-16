import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.theghanaianweb.com"),
  title: {
    default: "TheGhanaianWeb - Ghana News | Breaking News, Top Headlines, Photos & Videos",
    template: "%s | TheGhanaianWeb",
  },
  description:
        "Your source for breaking news, photos, and videos about Ghana, sports, business, entertainment, opinion, real estate, culture, fashion, and more.",
  keywords: [
    "Ghana news",
    "Ghana latest news",
    "African news",
    "Business news Ghana",
    "Entertainment Ghana",
    "Technology Ghana",
    "World news",
    "Ghanaweb",
    "Ghana politics",
    "Ghana sports",
    "Myjoyonline",
    "Ghana news today",
    "Ghana breaking news",
    "News Ghana",
    "Ghana news online",
    "Ghana news headlines",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.theghanaianweb.com/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.theghanaianweb.com/",
    siteName: "TheGhanaianWeb",
    title:
      "TheGhanaianWeb - Ghana News | Breaking News, Top Headlines, Photos & Videos",
    description:
      "Your source for breaking news, photos, and videos about Ghana, sports, business, entertainment, opinion, real estate, culture, fashion, and more.",
    images: [
      {
        url: "https://www.theghanaianweb.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TheGhanaianWeb - Ghana News",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@theghanaianweb",
    creator: "@theghanaianweb",
    title:
      "TheGhanaianWeb - Ghana News | Breaking News, Top Headlines, Photos & Videos",
    description:
      "Your source for breaking news, photos, and videos about Ghana, sports, business, entertainment, opinion, real estate, culture, fashion, and more.",
    images: ["https://www.theghanaianweb.com/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
  google: "your-google-site-verification-code",
  yandex: "your-yandex-verification-code",
  other: {
    bing: "your-bing-verification-code",
    "facebook-domain-verification": [
      "your-facebook-domain-verification-code",
        ],
    },
  },
};
