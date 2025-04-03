import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  avatar: varchar({ length: 255 }).notNull().default("/default-avatar-m.svg"),
  email: varchar({ length: 255 }).notNull().unique(),
});
