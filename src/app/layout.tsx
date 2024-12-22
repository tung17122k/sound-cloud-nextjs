
import Footer from '@/components/footer/app.footer';
import Header from '@/components/header/app.header';
import ThemeRegistry from '@/components/theme-registry/theme.registry';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <Header />
          {children}
          <Footer />
        </ThemeRegistry>
      </body>
    </html>
  );
}
