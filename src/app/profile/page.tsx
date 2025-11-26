"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProfileRoute } from "@/lib/auth";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  userType?: string;
  [key: string]: any;
}

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    // Get token from cookies
    const token = Cookies.get("token");

    if (!token) {
      // If no token, redirect to login
      router.push("/auth/login?returnTo=/profile&msg=login_required");
      return;
    }

    try {
      // Decode token to get user type
      const decoded = jwtDecode<JwtPayload>(token);
      const userType = decoded.userType;

      // Get the appropriate profile route based on user type
      const profileRoute = getProfileRoute(userType);

      // Redirect to the specific profile page
      router.replace(profileRoute);
    } catch (error) {
      console.error("Error decoding token:", error);
      // If token is invalid, redirect to login
      router.push("/auth/login?returnTo=/profile&msg=session_expired");
    }
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    </div>
  );
}
