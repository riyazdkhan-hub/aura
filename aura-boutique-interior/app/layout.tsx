import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aura Boutique Interior | Interior Decorator in Shilphata",
  description: "Discuss interior decoration, kitchen work and furniture with Aura Boutique Interior in Shilphata, Thane. Explore inspiration and enquire about your space.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"LocalBusiness",name:"Aura Boutique Interior",telephone:"+918879905630",address:{"@type":"PostalAddress",streetAddress:"Bloomfield Bharat Eco Vistas, Kalyan–Shilphata Road, Shilphata",addressLocality:"Thane",addressRegion:"Maharashtra",postalCode:"421204",addressCountry:"IN"}})}}/>{children}</body>
    </html>
  );
}
