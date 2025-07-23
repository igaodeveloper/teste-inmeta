import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
  rarity: text("rarity").notNull(), // common, rare, epic, legendary
  set: text("set").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userCards = pgTable("user_cards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  cardId: integer("card_id").notNull(),
  quantity: integer("quantity").default(1).notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export const trades = pgTable("trades", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").notNull(),
  message: text("message"),
  offeredCards: jsonb("offered_cards").notNull(), // array of {cardId, quantity}
  wantedCards: jsonb("wanted_cards").notNull(), // array of {cardId, quantity}
  status: text("status").default("open").notNull(), // open, completed, cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  name: true,
});

export const insertCardSchema = createInsertSchema(cards).pick({
  name: true,
  description: true,
  image: true,
  rarity: true,
  set: true,
});

export const insertUserCardSchema = createInsertSchema(userCards).pick({
  userId: true,
  cardId: true,
  quantity: true,
});

export const insertTradeSchema = createInsertSchema(trades).pick({
  creatorId: true,
  message: true,
  offeredCards: true,
  wantedCards: true,
});

// Select types
export type User = typeof users.$inferSelect;
export type Card = typeof cards.$inferSelect;
export type UserCard = typeof userCards.$inferSelect;
export type Trade = typeof trades.$inferSelect;

// Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCard = z.infer<typeof insertCardSchema>;
export type InsertUserCard = z.infer<typeof insertUserCardSchema>;
export type InsertTrade = z.infer<typeof insertTradeSchema>;

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
