import { cookies } from "next/headers";

export default async function handleCookies () {
    //zxcvbnm
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
}}