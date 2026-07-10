import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  decimal,
  boolean,
  pgEnum,
  date,
} from "drizzle-orm/pg-core";

export const orderStatusEnum = pgEnum("order_status", [
  "new",
  "processing",
  "production",
  "ready",
  "shipped",
  "completed",
  "cancelled",
]);

export const taskStatusEnum = pgEnum("task_status", [
  "pending",
  "in_progress",
  "completed",
  "cancelled",
]);

export const taskPriorityEnum = pgEnum("task_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

export const clientTypeEnum = pgEnum("client_type", [
  "individual",
  "company",
]);

export const requestStatusEnum = pgEnum("request_status", [
  "new",
  "in_progress",
  "completed",
  "rejected",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("manager"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: clientTypeEnum("type").notNull().default("company"),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  contactPerson: varchar("contact_person", { length: 255 }),
  notes: text("notes"),
  password: varchar("password", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: orderStatusEnum("status").notNull().default("new"),
  squareMeters: decimal("square_meters", { precision: 10, scale: 2 }).notNull(),
  pricePerMeter: decimal("price_per_meter", { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  deadline: date("deadline"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: taskStatusEnum("status").notNull().default("pending"),
  priority: taskPriorityEnum("priority").notNull().default("medium"),
  clientId: integer("client_id").references(() => clients.id, { onDelete: "set null" }),
  orderId: integer("order_id").references(() => orders.id, { onDelete: "set null" }),
  assignedTo: integer("assigned_to").references(() => users.id, { onDelete: "set null" }),
  dueDate: date("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const requests = pgTable("requests", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }),
  packagingType: varchar("packaging_type", { length: 100 }),
  volume: varchar("volume", { length: 50 }),
  message: text("message"),
  status: requestStatusEnum("status").notNull().default("new"),
  clientId: integer("client_id").references(() => clients.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(),
  description: text("description").notNull(),
  clientId: integer("client_id").references(() => clients.id, { onDelete: "cascade" }),
  orderId: integer("order_id").references(() => orders.id, { onDelete: "cascade" }),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
});
