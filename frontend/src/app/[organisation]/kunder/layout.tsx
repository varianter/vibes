export default function KunderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="overflow-scroll main">{children}</div>;
}
