"use client";
import { usePathname } from "next/navigation";

export default function NavBarLink(props: { text: string; path: string }) {
  const pathname = usePathname();
  const isCurrentPath = props.path.includes(pathname);

  if (isCurrentPath) {
    return (
      <a
        className="p-4 body-large-bold text-white flex justify-items-center border-b-[3px] border-secondary_default "
        href={`${props.path}`}
      >
        {props.text}
      </a>
    );
  } else
    return (
      <a
        className="p-4 body-large text-white opacity-70 flex justify-items-center hover:opacity-100 "
        href={`${props.path}`}
      >
        {props.text}
      </a>
    );
}
