import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "Kosen Systems | Precision Hardware Modules",
  description:
    "High-efficiency DC-DC buck converters, IoT development boards, and embedded hardware modules. Professional-grade power solutions for industrial and maker applications.",
  keywords: "DC-DC converter, buck converter, IoT, ESP32, embedded systems, hardware modules, Kosen Systems",
  icons: {
    icon: "/logos/Favicon 32x32 White.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
      <body>
        <CartProvider>
          <AuthProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
