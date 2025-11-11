"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function RoleGuard({ allowedRoles = [], children }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");

    // No token or role → redirect
    if (!token || !role) {
        alert("Not authorized sign in to contribute");
      router.push("/login");
      return;
    }

    // Check if role is authorized
    if (allowedRoles.includes(role)) {
      setAuthorized(true);
    } else {
      alert("You are not authorized to access this page.");
      router.push("/");
    }

    setLoading(false);
  }, [allowedRoles, router]);

  // Optional: show loader while verifying
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg animate-pulse">
          Checking authorization...
        </p>
      </div>
    );
  }

  return authorized ? children : null;
}
