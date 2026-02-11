import {
    pgTable,
    uuid,
    varchar,
    text,
    boolean,
    integer,
    date,
    timestamp,
    pgEnum,
    serial,
    unique,
} from "drizzle-orm/pg-core";

// Enums
export const holidayRecurrenceType = pgEnum("holiday_recurrence_type", [
    "fixed",
    "lunar",
    "variable",
]);

export const holidayStatus = pgEnum("holiday_status", ["active", "inactive"]);

// Tables
export const adminUsers = pgTable("admin_users", {
    id: uuid("id").primaryKey().defaultRandom(),
    username: varchar("username", { length: 50 }).unique().notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    fullName: varchar("full_name", { length: 100 }),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const holidayTypes = pgTable("holiday_types", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).unique().notNull(),
    nameKm: varchar("name_km", { length: 100 }),
    description: text("description"),
    colorCode: varchar("color_code", { length: 7 }).default("#FF0000"),
    icon: varchar("icon", { length: 50 }),
    sortOrder: integer("sort_order").default(0),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const holidays = pgTable("holidays", {
    id: uuid("id").primaryKey().defaultRandom(),
    holidayTypeId: uuid("holiday_type_id")
        .notNull()
        .references(() => holidayTypes.id),
    name: varchar("name", { length: 255 }).notNull(),
    nameKm: varchar("name_km", { length: 255 }),
    description: text("description"),
    descriptionKm: text("description_km"),
    recurrenceType: holidayRecurrenceType("recurrence_type")
        .notNull()
        .default("fixed"),
    fixedMonth: integer("fixed_month"),
    fixedDay: integer("fixed_day"),
    lunarMonth: integer("lunar_month"),
    lunarDay: integer("lunar_day"),
    lunarWaxing: boolean("lunar_waxing"),
    durationDays: integer("duration_days").default(1),
    isPublicHoliday: boolean("is_public_holiday").default(false),
    isBankHoliday: boolean("is_bank_holiday").default(false),
    status: holidayStatus("status").default("active"),
    createdBy: uuid("created_by").references(() => adminUsers.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const holidayDates = pgTable("holiday_dates", {
    id: uuid("id").primaryKey().defaultRandom(),
    holidayId: uuid("holiday_id")
        .notNull()
        .references(() => holidays.id, { onDelete: "cascade" }),
    year: integer("year").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    isConfirmed: boolean("is_confirmed").default(false),
    notes: text("notes"),
    createdBy: uuid("created_by").references(() => adminUsers.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const khmerLunarMonths = pgTable("khmer_lunar_months", {
    id: serial("id").primaryKey(),
    monthNumber: integer("month_number").unique().notNull(),
    name: varchar("name", { length: 50 }).notNull(),
    nameKm: varchar("name_km", { length: 50 }),
    description: text("description"),
});

export const specialEvents = pgTable("special_events", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    nameKm: varchar("name_km", { length: 255 }),
    description: text("description"),
    descriptionKm: text("description_km"),
    eventDate: date("event_date").notNull(),
    year: integer("year").notNull(),
    isBuddhistDay: boolean("is_buddhist_day").default(false),
    isRoyalEvent: boolean("is_royal_event").default(false),
    status: holidayStatus("status").default("active"),
    createdBy: uuid("created_by").references(() => adminUsers.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});