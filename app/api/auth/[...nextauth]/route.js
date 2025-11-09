import NextAuth from "next-auth"
import { authOptions } from "./options"


const handler = NextAuth(req, res, authOptions)
export {handler as GET, handler as POST}       