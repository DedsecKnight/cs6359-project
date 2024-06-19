import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const credentialsTable = pgTable('credentials', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
});

export const adminTable = pgTable('admin_credentials', {
  id: serial('id').primaryKey(),
  credentialsId: integer('credentials_id').notNull().references(() => credentialsTable.id)
})

export const advertiserTable = pgTable('advertiser_credentials', {
  id: serial('id').primaryKey(),
  credentialsId: integer('credentials_id').notNull().references(() => credentialsTable.id)
})

export const webTable = pgTable('web', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  description: text('description').notNull()  
})

export const advertisementTable = pgTable('advertisements', {
  id: serial('id').primaryKey(),
  advertiserId: integer('advertiser_id').notNull().references(() => advertiserTable.id),
  content: text('content').notNull()
})

export type InsertAdvertiser = typeof advertiserTable.$inferInsert;
export type SelectAdvertiser = typeof advertiserTable.$inferSelect;
