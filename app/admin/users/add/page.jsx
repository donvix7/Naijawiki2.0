"use client";

import React, { useState, useEffect } from "react";
import feather from "feather-icons";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/adminNavbar";
import AdminSidebar from "@/components/adminSideBar";
import RoleGuard from "@/utils/RoleGuard";
import getBaseUrl from "@/app/api/baseUrl";

export default function Page() {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("creator"); // Default role
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const base_url = getBaseUrl();
  const router = useRouter();

  useEffect(() => {
    // safer load
    setTimeout(() => feather.replace(), 50);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const trimmedEmail = email.trim();
    const trimmedFirst = firstname.trim();
    const trimmedLast = lastname.trim();

    if (!trimmedFirst || !trimmedLast || !trimmedEmail) {
      setStatus({
        message: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    if (password.length < 8) {
      setStatus({
        message: "Password must be at least 8 characters.",
        type: "error",
      });
      return;
    }

    if (password !== confirm) {
      setStatus({ message: "Passwords do not match.", type: "error" });
      return;
    }

    setLoading(true);
    setStatus({ message: "", type: "" });

    try {
      const res = await fetch(`${base_url}/admin/users`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get("token")}`
        },
        body: JSON.stringify({
          firstname: trimmedFirst,
          lastname: trimmedLast,
          email: trimmedEmail,
          password,
          role: role
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus({
          message: data.message || "User creation failed. Please try again.",
          type: "error",
        });
      } else {
        setStatus({
          message: "User account created successfully!",
          type: "success",
        });

        // Reset input fields
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirm("");
        setRole("creator");

        // Redirect to users list after success
        setTimeout(() => {
          router.push("/admin/users");
        }, 1500);
      }
    } catch (error) {
      console.error("User creation error:", error);
      setStatus({
        message: "Something went wrong. Please try again later.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleGuard allowedRoles={["admin", "super_admin"]}>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex">
          <AdminSidebar />

         <SubmitWordForm/>
        </div>
      </div>
    </RoleGuard>
  );
}