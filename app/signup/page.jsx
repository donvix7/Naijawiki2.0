"use client";
import CustomFooter from '@/components/customFooter'
import CustomNavbar from '@/components/navBar'
import React, { useState } from 'react'

const page = () => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const role = "creator";

    const handleSubmit = async (e) => {
  e.preventDefault();

  if (password !== confirm) {
    // Display error in your UI
    alert("password doesnt match")
    return;
  }

  try {
    const res = await fetch("http://wiki-server.giguild.com/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        role,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      // Show error to user instead of just console log
      console.log("res not ok");
      return { success: false, message: data.message };
    }
    return { success: true, message: data.message };
  } catch (error) {
    console.log(error);
  }
};

    
  return (
    <div>

    <CustomNavbar/>
  <main className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-secondary mb-2">Create Account</h1>
                <p className="text-gray-600">Join our community of language enthusiasts</p>
            </div>
            <form className="space-y-6"
            onSubmit = {handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
                        <input type="text" id="first-name" required
                        onChange = {(e) => setFirstName(e.target.value)}
                        value = {firstName}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                            placeholder="John"></input>
                    </div>
                    <div>
                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                        <input type="text" id="last-name" required
                        onChange = {(e) => setLastName(e.target.value)}
                        value = {lastName}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                            placeholder="Doe"></input>
                    </div>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                    <input type="email" id="email" required
                    onChange = {(e) => setEmail(e.target.value)}
                        value = {email}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        placeholder="your@email.com"></input>
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
                    <input type="password" id="password" required
                    onChange = {(e) => setPassword(e.target.value)}
                        value = {password}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        placeholder="••••••••"></input>
                    <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
                </div>
                <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm
                        Password*</label>
                    <input type="password" id="confirm-password" required
                    onChange = {(e) => setConfirm(e.target.value)}
                        value = {confirm}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        placeholder="••••••••"></input>
                </div>
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input id="terms" type="checkbox" required
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"></input>
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="text-gray-700"> I agree to the <a href="/terms.html"
                                className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy.html"
                                className="text-primary hover:underline">Privacy Policy</a>
                        </label>
                    </div>
                </div>
                <button type="submit"
                    className="w-full bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                    Create Account </button>
                <div className="text-center text-sm text-gray-500"> Already have an account? <a href="/login.html"
                        className="text-primary hover:underline">Login</a>
                </div>
            </form>
            <div className="mt-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                    </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                    <button type="button"
                        className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <i data-feather="facebook" className="text-blue-600"></i> Facebook </button>
                    <button type="button"
                        className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <i data-feather="google" className="text-red-600"></i> Google </button>
                </div>
            </div>
        </div>
    </main>
<CustomFooter/>    
      </div>
  )
  }

export default page