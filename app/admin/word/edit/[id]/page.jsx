"use client";

import AdminNavbar from "@/components/adminNavbar";
import AdminSidebar from "@/components/adminSideBar";
import getBaseUrl from "@/app/api/baseUrl";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import feather from "feather-icons";
import { useParams } from "next/navigation";
import RoleGuard from "@/utils/RoleGuard";

export default function Page() {

  const params = useParams();
  const id = params.id;

  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = Cookies.get("token");
  const base_url = getBaseUrl();

  // Fetch a single word
  useEffect(() => {
    const fetchWord = async () => {
      try {
        const res = await fetch(`${base_url}/word/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch word");

        const data = await res.json();
        setWord(data.word);
      } catch (err) {
        console.error("Failed to load word:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWord();
    feather.replace();
  }, [id]);

  // Update status
  const updateStatus = async (status) => {
    try {
      const res = await fetch(`${base_url}/word/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setWord((prev) => ({ ...prev, status }));

      alert(`Word has been ${status}!`);
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  if (!word) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Word not found.
      </div>
    );
  }

  return (
      <RoleGuard allowedRoles={["admin", "super_admin"]}>
    <div>
      <AdminNavbar />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6 text-secondary">
            Manage Word
          </h1>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody>
                <tr>
                  <td className="px-6 py-4 font-semibold">Word</td>
                  <td className="px-6 py-4">{word.word}</td>
                </tr>

                <tr>
                  <td className="px-6 py-4 font-semibold">Language</td>
                  <td className="px-6 py-4">{word.language}</td>
                </tr>

                <tr>
                  <td className="px-6 py-4 font-semibold">Status</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        word.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : word.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {word.status}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4 font-semibold">Submitted By</td>
                  <td className="px-6 py-4">{word.creatorEmail || "—"}</td>
                </tr>

                <tr>
                  <td className="px-6 py-4 font-semibold">Actions</td>
                  <td className="px-6 py-4 flex gap-4">
                    <button
                      onClick={() => updateStatus("approved")}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center gap-1"
                    >
                      <i data-feather="check"></i> Approve
                    </button>

                    <button
                      onClick={() => updateStatus("rejected")}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center gap-1"
                    >
                      <i data-feather="x"></i> Reject
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
    </RoleGuard>
  );
}
