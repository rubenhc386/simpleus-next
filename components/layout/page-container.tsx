export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      {children}
    </div>
  );
}
