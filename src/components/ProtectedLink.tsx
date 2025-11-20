"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { isLoggedIn, buildLoginUrl } from "public/src/lib/auth";

type Props = LinkProps & {
  children: React.ReactNode;
  requireAuth?: boolean; // true para Trabajo/Voluntariado y compra/venta 
  className?: string;
};

export default function ProtectedLink({ requireAuth = false, href, children, className, ...rest }: Props) {
  const router = useRouter();

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    if (!requireAuth) return;
    if (!isLoggedIn()) {
      e.preventDefault();
      const target = typeof href === "string" ? href : href.toString();
      router.push(buildLoginUrl(target, "login_required"));  // /auth/login?returnTo=/offers/123
    }
  }

  return (
    <Link href={href} {...rest} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
