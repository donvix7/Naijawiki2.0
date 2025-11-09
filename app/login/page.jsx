"use client";
import CustomFooter from '@/components/customFooter'
import CustomNavbar from '@/components/navBar'
import React, { useState } from 'react'

export default function page (){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email,password);

    try{
        const res = await fetch("http://wiki-server.giguild.com/api/auth/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
               
            },
             body: JSON.stringify({email, password})

        }
    )
    if(!res.ok) {
        console.log("res not ok");
    }
    return res.json()

    const cookieStore = await cookies();
    cookieStore.set({
        name: "token",
        value: data.token,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path:"/",
        maxAge: 60 * 60 * 24,
    });
    if (data.role === "admin") {redirect("/admin/dashboard")
        return {success: true, message: data.message}
   } if (data.role === "moderator") {redirect("/moderator/dashboard")
        return {success: true, message: data.message}
    }if (data.role === "creator") {redirect("/")
        return {success: true, message: data.message}
}
    else {
        alert("user not found");
        return;
    }
    }catch(error) {
        console.log(error);

    }
   
}
  return (
    <div>

        <CustomNavbar/>

    <main className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-secondary mb-2">Welcome Back</h1>
                <p className="text-gray-600">Login to your NaijaLingo account</p>
            </div>
            <form className="space-y-6"
            onSubmit = {handleSubmit}>
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
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input id="remember" type="checkbox"
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"/>
                        <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">Remember me</label>
                    </div>
                    <a href="/forgot-password " className="text-sm text-primary hover:underline">Forgot password?</a>
                </div>
                <button type="submit"
                    className="w-full bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                    Login </button>
                <div className="text-center text-sm text-gray-500"> Don't have an account? <a href="/signup"
                        className="text-primary hover:underline">Sign up</a>
                </div>
            </form>
            <div className="mt-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
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
  );
}

