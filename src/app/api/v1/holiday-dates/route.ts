import { db } from "@/db";
import { holidayDates, holidays } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/v1/holiday-dates?year=2026&holidayId=xxx — Public
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");
  const holidayId = searchParams.get("holidayId");

  let query = db
    .select({
      id: holidayDates.id,
      holidayId: holidayDates.holidayId,
      holidayName: holidays.name,
      holidayNameKm: holidays.nameKm,
      year: holidayDates.year,
      startDate: holidayDates.startDate,
      endDate: holidayDates.endDate,
      isConfirmed: holidayDates.isConfirmed,
      notes: holidayDates.notes,
    })
    .from(holidayDates)
    .leftJoin(holidays, eq(holidayDates.holidayId, holidays.id));

  // Apply filters
  const conditions = [];
  if (year) conditions.push(eq(holidayDates.year, parseInt(year)));
  if (holidayId) conditions.push(eq(holidayDates.holidayId, holidayId));

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }

  const results = await query;
  return NextResponse.json({ data: results });
}

// POST /api/v1/holiday-dates — Admin only
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newDate = await db
      .insert(holidayDates)
      .values({
        holidayId: body.holidayId,
        year: body.year,
        startDate: body.startDate,
        endDate: body.endDate,
        isConfirmed: body.isConfirmed ?? false,
        notes: body.notes,
      })
      .returning();

    return NextResponse.json({ data: newDate[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create holiday date" },
      { status: 500 }
    );
  }
}