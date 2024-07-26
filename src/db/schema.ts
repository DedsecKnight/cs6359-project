import { integer, pgTable, serial, text, real } from "drizzle-orm/pg-core";

export const credentialsTable = pgTable("credentials", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const adminTable = pgTable("admin_credentials", {
  id: serial("id").primaryKey(),
  credentialsId: integer("credentials_id")
    .notNull()
    .references(() => credentialsTable.id),
});

export const advertiserTable = pgTable("advertiser_credentials", {
  id: serial("id").primaryKey(),
  credentialsId: integer("credentials_id")
    .notNull()
    .references(() => credentialsTable.id),
});

export const webTable = pgTable("web", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  description: text("description").notNull(),
  numAccessed: integer("num_accessed").notNull().default(0),
});

export const advertisementTierTable = pgTable("advertisement_tier", {
  id: serial("id").primaryKey(),
  tierName: text("tier_name").notNull(),
  tierPrice: real("tier_price").notNull(),
  tierRank: integer("tier_rank").notNull(),
});

export const advertisementTable = pgTable("advertisements", {
  id: serial("id").primaryKey(),
  advertiserId: integer("advertiser_id")
    .notNull()
    .references(() => advertiserTable.id),
  content: text("content").notNull(),
  advertisementTierId: integer("tier_id")
    .notNull()
    .references(() => advertisementTierTable.id),
});

export const tagTable = pgTable("tags", {
  id: serial("id").primaryKey(),
  webpageId: integer("webpage_id")
    .notNull()
    .references(() => webTable.id),
  tagName: text("tag_name").notNull(),
});

export const billingAccountTable = pgTable("billing_accounts", {
  id: serial("id").primaryKey(),
  advertiserId: integer("advertiser_id")
    .notNull()
    .references(() => advertiserTable.id),
  creditCardNumber: text("credit_card_number").notNull(),
});

export const transactionTable = pgTable("transaction", {
  id: serial("id").primaryKey(),
  billingAccountId: integer("billing_account_id")
    .notNull()
    .references(() => billingAccountTable.id),
  advertisementId: integer("advertisement_id")
    .notNull()
    .references(() => advertisementTable.id),
});

export type InsertAdvertiser = typeof advertiserTable.$inferInsert;
export type SelectAdvertiser = typeof advertiserTable.$inferSelect;
