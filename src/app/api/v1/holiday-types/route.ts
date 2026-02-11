import { db } from "@/db";
import { holidayTypes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/v1/holiday-types — Public
export async function GET() {
  const results = await db
    .select()
    .from(holidayTypes)
    .where(eq(holidayTypes.isActive, true))
    .orderBy(holidayTypes.sortOrder);

  return NextResponse.json({ data: results });
}

// POST /api/v1/holiday-types — Admin only
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newType = await db
      .insert(holidayTypes)
      .values({
        name: body.name,
        nameKm: body.nameKm,
        description: body.description,
        colorCode: body.colorCode,
        icon: body.icon,
        sortOrder: body.sortOrder,
      })
      .returning();

    return NextResponse.json({ data: newType[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create holiday type" },
      { status: 500 }
    );
  }
}