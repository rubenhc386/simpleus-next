import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageContainer from "@/components/layout/page-container";

export const metadata = {
  title: "SimpleUS by RubenHC",
  description: "Entiende cartas en inglés con claridad, calma y en español.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <PageContainer>{children}</PageContainer>
        <Footer />
      </body>
    </html>
  );
}
