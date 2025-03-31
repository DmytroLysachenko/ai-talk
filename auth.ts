import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [],
  callbacks: {
    signIn: async ({ user }) => {
      console.log(user);
      return true;
    },
  },
});
