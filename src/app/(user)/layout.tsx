
import Footer from '@/components/footer/app.footer';
import Header from '@/components/header/app.header';



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
