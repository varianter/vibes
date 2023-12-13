export default function FerieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="overflow-scroll main">{children}</div>;
}
