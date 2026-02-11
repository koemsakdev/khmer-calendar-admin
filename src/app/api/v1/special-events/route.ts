import { db } from "@/db";
import { specialEvents } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/v1/special-events?year=2026 — Public
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");

  const conditions = [eq(specialEvents.status, "active" as const)];
  if (year) conditions.push(eq(specialEvents.year, parseInt(year)));

  const results = await db
    .select()
    .from(specialEvents)
    .where(and(...conditions))
    .orderBy(specialEvents.eventDate);

  return NextResponse.json({ data: results });
}

// POST /api/v1/special-events — Admin only
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newEvent = await db
      .insert(specialEvents)
      .values({
        name: body.name,
        nameKm: body.nameKm,
        description: body.description,
        descriptionKm: body.descriptionKm,
        eventDate: body.eventDate,
        year: body.year,
        isBuddhistDay: body.isBuddhistDay ?? false,
        isRoyalEvent: body.isRoyalEvent ?? false,
      })
      .returning();

    return NextResponse.json({ data: newEvent[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create special event" },
      { status: 500 }
    );
  }
}