import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        // In a real application, you would verify the credentials against your database
        // This is a mock implementation for demonstration purposes
        if (credentials?.email && credentials?.password) {
          // Return a mock user based on the role
          return {
            id: "1",
            name:
              credentials.email === "doctor@example.com"
                ? "Dr. Sarah Johnson"
                : credentials.email === "patient@example.com"
                  ? "Maria Gonzalez"
                  : "Admin User",
            email: credentials.email,
            role: credentials.role || "patient",
            image: null,
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
})

export { handler as GET, handler as POST }
