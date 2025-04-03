import NextAuth, { User } from "next-auth";
import Google from "next-auth/providers/google";

import { createUser, getUserByEmail } from "../lib/actions/auth.action";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    signIn: async ({ user }: { user: User }) => {
      const existingUser = await getUserByEmail(user.email!);

      if (existingUser.success && existingUser.user) {
        return true;
      }

      const { success } = await createUser({
        name: user.name!,
        email: user.email!,
        avatar: user.image!,
      });

      if (success) {
        return true;
      }

      return false;
    },
  },
});
