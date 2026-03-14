import "./globals.css";

export const metadata = {
  title: "SimpleUS",
  description: "Entiende cartas importantes en inglés con claridad, calma y en español.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          background: "#f9fafb",
          color: "#111827",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
