import type { Stat } from "../types";
import { db } from "@/db";
import { holidays, holidayDates, specialEvents } from "@/db/schema";
import { count, eq } from "drizzle-orm";

export async function getDashboardStats(): Promise<Stat[]> {
  const [holidayCount] = await db.select({ value: count() }).from(holidays);
  const [eventCount] = await db.select({ value: count() }).from(specialEvents);
  const [unconfirmedDates] = await db
    .select({ value: count() })
    .from(holidayDates)
    .where(eq(holidayDates.isConfirmed, false));

  return [
    { title: "Total Holidays", value: holidayCount.value, icon: "calendar" },
    { title: "Special Events", value: eventCount.value, icon: "star" },
    { title: "Pending Confirmation", value: unconfirmedDates.value, icon: "shield" },
  ];
}
