'use client'

import Providers from "../store/providers";
import ThemeInitializer from "../store/themeInitializer";
import GlobalStyles from "../styles/GlobalStyles";
import ProgressBar from "@/components/progressBar";
import { usePathname } from "next/navigation";
import StyledComponentsRegistry from "./registry";
import ScrollToTop from "@/hooks/scrollToTop";
import Header from "@/components/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <Providers>
            {/* <ProgressBar /> */}
            <ThemeInitializer />
            <GlobalStyles />
            <ScrollToTop />
            <Header />
            {children}
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
