"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createUser = async ({
  name,
  email,
  avatar,
}: {
  name: string;
  email: string;
  avatar?: string;
}) => {
  try {
    const [user] = await db
      .insert(users)
      .values({
        name,
        email,
        avatar: avatar || "/default-avatar-m.svg",
      })
      .returning();

    return { success: true, user, error: null };
  } catch (error) {
    console.log(error);
    return { success: false, user: null, error: "Failed to create user" };
  }
};

export const getUserById = async (id: string) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return { success: true, user, error: null };
  } catch (error) {
    console.log(error);
    return { success: false, user: null, error: "Failed to fetch user" };
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return { success: true, user, error: null };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      user: null,
      error: "Failed to fetch user by email",
    };
  }
};

export const updateUser = async (
  id: string,
  updates: {
    name?: string;
    email?: string;
    avatar?: string;
  }
) => {
  try {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();

    return { success: true, user, error: null };
  } catch (error) {
    console.log(error);
    return { success: false, user: null, error: "Failed to update user" };
  }
};

export const deleteUser = async (id: string) => {
  try {
    const [user] = await db.delete(users).where(eq(users.id, id)).returning();

    revalidatePath("/users");
    return { success: true, user, error: null };
  } catch (error) {
    console.log(error);
    return { success: false, user: null, error: "Failed to delete user" };
  }
};

export const getAllUsers = async () => {
  try {
    const allUsers = await db.select().from(users);
    return { success: true, users: allUsers, error: null };
  } catch (error) {
    console.log(error);
    return { success: false, users: null, error: "Failed to fetch users" };
  }
};
