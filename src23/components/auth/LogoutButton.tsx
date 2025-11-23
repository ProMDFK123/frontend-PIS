"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { logoutAndRedirect } from "@/lib/auth";

type Props = React.ComponentProps<typeof Button> & {
  children?: React.ReactNode;
};

export default function LogoutButton({ children, ...props }: Props) {
  return (
    <Button
      {...props}
      variant={props.variant ?? "ghost"}
      onClick={() => logoutAndRedirect("/")}
      aria-label={typeof children === "string" ? children : "Salir"}
    >
      {children ?? "Salir"}
    </Button>
  );
}
