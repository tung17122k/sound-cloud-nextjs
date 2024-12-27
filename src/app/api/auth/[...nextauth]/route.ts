import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { AuthOptions } from "next-auth"

export const authOptions: AuthOptions = {
    // Configure one or more authentication providers
    secret: process.env.NO_SECRET,
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        // ...add more providers here
    ],
    callbacks: {
        async jwt({ token, user, account, profile, trigger }) {
            if (trigger === "signIn" && account?.provider === "github") {
                token.address = "Ha Noi"
            }
            return token
        },
        async session({ session, token, user }) {
            //@ts-ignore
            session.address = token.address;
            return session
        }
    }
}


const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }