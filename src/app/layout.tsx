
import Footer from '@/components/footer/app.footer';
import Header from '@/components/header/app.header';
import ThemeRegistry from '@/components/theme-registry/theme.registry';
import NextAuthWrapper from '@/lib/next.auth.provider';
import { SessionProvider } from "next-auth/react"


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <NextAuthWrapper>
            <Header />
            {children}
            <Footer />
          </NextAuthWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
