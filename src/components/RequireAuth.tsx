"use client";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

export default function RequireAuth({ children }: Props) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      const params = new URLSearchParams({ returnTo: pathname });
      router.push(`/auth/login?${params.toString()}`);
    }
  }, [status, pathname, router]);

  if (status === "loading") return null;
  if (status === "authenticated") return <>{children}</>;
  return null;
}
