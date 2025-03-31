import type { NextConfig } from "next";
import Google from "next-auth/providers/google";
import { User } from "next-auth";

import { createUser, getUserByEmail } from "./lib/actions/auth.action";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
