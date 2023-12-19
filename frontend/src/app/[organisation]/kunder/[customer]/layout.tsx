export default function KundeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="overflow-scroll main">{children}</div>;
}
