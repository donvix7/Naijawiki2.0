"use client";

import React, { useEffect, useState } from "react";
import CustomNavbar from "@/components/navBar";
import CustomFooter from "@/components/customFooter";
import FilterForm from "@/components/filterForm";
import Cookies from "js-cookie";

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [token, setToken] = useState(null);

  // Fix hydration & cookie loading
  useEffect(() => {
    setHydrated(true);

    const savedToken = Cookies.get("token");
    if (savedToken) {
      setIsLoggedIn(true);
      setToken(savedToken);
    }
  }, []);

  // Prevent hydration mismatch
  if (!hydrated) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <CustomNavbar />

      <main className="flex-grow">
        <FilterForm isLoggedIn={isLoggedIn} token={token} />
      </main>

      <CustomFooter />
    </div>
  );
}
