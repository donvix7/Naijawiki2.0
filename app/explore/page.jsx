"use client";

import React, { useEffect, useState } from "react";
import CustomNavbar from "@/components/navBar";
import CustomFooter from "@/components/customFooter";
import FilterForm from "@/components/filterForm";
import Cookies from "js-cookie";

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

    const token = Cookies.get('token');
    if(token) {
      setIsLoggedIn(!isLoggedIn);
    }
  return (
    <div className="min-h-screen flex flex-col">
      <CustomNavbar />

      <main className="flex-grow">
        {/* Pass login status to FilterForm */}
        <FilterForm isLoggedIn={isLoggedIn} token={token} />
      </main>

      <CustomFooter />
    </div>
  );
}