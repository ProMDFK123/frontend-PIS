"use client";
import React, { ReactNode } from "react";

type Props = {
  avatarUrl?: string;
  username: string;
  email?: string;
  phone?: string;
  children?: ReactNode;
};

export default function ProfileCard({
  avatarUrl,
  username,
  email,
  phone,
  children,
}: Props) {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-6">
        <img
          src={avatarUrl || "/placeholder-avatar.png"}
          alt="avatar"
          className="w-28 h-28 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-2xl font-semibold">{username}</h2>
          {email && <p className="text-sm text-muted-foreground">{email}</p>}
          {phone && <p className="text-sm text-muted-foreground">{phone}</p>}
        </div>
      </div>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
