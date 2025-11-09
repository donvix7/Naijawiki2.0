import {NextAuthOptions} from "next-auth/providers"
import GoogleProvider from "next-auth/providers/google"

     console.log({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,

    })
export const authOptions =  {

   
    providers: [
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,

  
})    
        
    ],
    pages: {
        signIn: "/login",
        signOut: "/logout",
    },
    async session({session}) {

    },
    async signIn({profile}) {

    }
}
    