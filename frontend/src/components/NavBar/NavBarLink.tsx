"use client";
import { usePathname } from "next/navigation";

export default function NavBarLink(props: { text: string; path: string }) {
  const pathname = usePathname();
  const isCurrentPath = pathname.includes(props.path);
  const orgUrl = pathname.split("/")[1] || "";

  return (
    <a
      className={`p-4 flex justify-center items-center text-white ${
        isCurrentPath
          ? "large-medium border-b-[3px] border-secondary"
          : "large opacity-70 hover:opacity-100"
      }`}
      href={orgUrl != "" ? `/${orgUrl}/${props.path}` : "/"}
    >
      {props.text}
    </a>
  );
}
