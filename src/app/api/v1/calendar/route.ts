import { db } from "@/db";
import { holidays, holidayDates, holidayTypes, specialEvents } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getKhmerYearInfo } from "@/lib/khmer-year";
import { NextRequest, NextResponse } from "next/server";

// GET /api/v1/calendar?year=2026
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(
    searchParams.get("year") || new Date().getFullYear().toString()
  );

  // 1. Get holidays with dates
  const holidayResults = await db
    .select({
      holidayId: holidays.id,
      name: holidays.name,
      nameKm: holidays.nameKm,
      description: holidays.description,
      startDate: holidayDates.startDate,
      endDate: holidayDates.endDate,
      durationDays: holidays.durationDays,
      isPublicHoliday: holidays.isPublicHoliday,
      isBankHoliday: holidays.isBankHoliday,
      recurrenceType: holidays.recurrenceType,
      isConfirmed: holidayDates.isConfirmed,
      notes: holidayDates.notes,
      holidayType: holidayTypes.name,
      holidayTypeKm: holidayTypes.nameKm,
      colorCode: holidayTypes.colorCode,
      icon: holidayTypes.icon,
    })
    .from(holidayDates)
    .innerJoin(holidays, eq(holidayDates.holidayId, holidays.id))
    .innerJoin(holidayTypes, eq(holidays.holidayTypeId, holidayTypes.id))
    .where(and(eq(holidayDates.year, year), eq(holidays.status, "active")))
    .orderBy(holidayDates.startDate);

  // 2. Get special events
  const eventResults = await db
    .select()
    .from(specialEvents)
    .where(and(eq(specialEvents.year, year), eq(specialEvents.status, "active")))
    .orderBy(specialEvents.eventDate);

  // 3. Get Khmer year info (calculated, no DB)
  const khmerYear = getKhmerYearInfo(year);

  return NextResponse.json({
    year,
    khmerYear,
    holidays: holidayResults,
    specialEvents: eventResults,
    totalHolidays: holidayResults.length,
    totalEvents: eventResults.length,
  });
}