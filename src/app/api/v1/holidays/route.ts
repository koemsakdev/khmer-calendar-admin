import { db } from "@/db";
import { holidays, holidayTypes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/v1/holidays — Public
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "active";

  const results = await db
    .select({
      id: holidays.id,
      name: holidays.name,
      nameKm: holidays.nameKm,
      description: holidays.description,
      recurrenceType: holidays.recurrenceType,
      fixedMonth: holidays.fixedMonth,
      fixedDay: holidays.fixedDay,
      durationDays: holidays.durationDays,
      isPublicHoliday: holidays.isPublicHoliday,
      status: holidays.status,
      holidayType: holidayTypes.name,
      holidayTypeColor: holidayTypes.colorCode,
    })
    .from(holidays)
    .leftJoin(holidayTypes, eq(holidays.holidayTypeId, holidayTypes.id))
    .where(eq(holidays.status, status as "active" | "inactive"));

  return NextResponse.json({ data: results });
}

// POST /api/v1/holidays — Admin only
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newHoliday = await db
      .insert(holidays)
      .values({
        name: body.name,
        nameKm: body.nameKm,
        holidayTypeId: body.holidayTypeId,
        description: body.description,
        descriptionKm: body.descriptionKm,
        recurrenceType: body.recurrenceType,
        fixedMonth: body.fixedMonth,
        fixedDay: body.fixedDay,
        lunarMonth: body.lunarMonth,
        lunarDay: body.lunarDay,
        lunarWaxing: body.lunarWaxing,
        durationDays: body.durationDays,
        isPublicHoliday: body.isPublicHoliday,
        isBankHoliday: body.isBankHoliday,
      })
      .returning();

    return NextResponse.json({ data: newHoliday[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create holiday" },
      { status: 500 }
    );
  }
}