import type { Metadata } from "next";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: "ប្រតិទិនកូនខ្មែរ",
  description: "ប្រតិទិនកូនខ្មែរ សម្រាប់ពិនិត្យមើលថ្ងៃសីល ថ្ងៃឈប់សម្រាក និងបុណ្យជាតិ។ ប្រតិទិនចន្ទគតិខ្មែរត្រឹមត្រូវ និងច្បាស់លាស់។",
  keywords: ["Khmer Calendar", "ប្រតិទិនកូនខ្មែរ", "Lunar Calendar", "Cambodia Holidays", "ថ្ងៃសីល"],
  authors: [{ name: "Koemsak Mean" }],
  // openGraph: {
  //   title: "ប្រតិទិនកូនខ្មែរ - Khmer Calendar",
  //   description: "ប្រតិទិនចន្ទគតិខ្មែរ ថ្ងៃសីល និងថ្ងៃឈប់សម្រាក",
  //   url: "http://localhost:3000",
  //   siteName: "Khmer Calendar",
  //   images: [
  //     {
  //       url: "/og-image.jpg", // Create a 1200x630 image
  //       width: 1200,
  //       height: 630,
  //       alt: "Khmer Calendar Preview",
  //     },
  //   ],
  //   locale: "km_KH",
  //   type: "website",
  // },
  // robots: {
  //   index: true,
  //   follow: true,
  // }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            className: "rounded-[20px] border-none flex items-start gap-4",
            descriptionClassName: "text-slate-500 font-normal",
            classNames: {
              error: "bg-[#FFD5D5] text-slate-900",
              success: "bg-emerald-50 text-slate-900",
              info: "bg-blue-50 text-slate-900",
              title: "font-semibold text-[16px]",
              description: "text-[14px]",
            }
          }}
        />
      </body>
    </html>
  );
}
