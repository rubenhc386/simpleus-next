import "./globals.css";
import ReferralTracker from "@/components/ReferralTracker";

export const metadata = {
  title: "SimpleUS",
  description:
    "Entiende cartas importantes en inglés con claridad, calma y en español.",
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
        <ReferralTracker />
        {children}
      </body>
    </html>
  );
}