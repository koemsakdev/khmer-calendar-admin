import { getKhmerYearInfo, getKhmerYearRange } from "@/lib/khmer-year";
import { NextRequest, NextResponse } from "next/server";

// GET /api/v1/khmer-years?year=2026
// GET /api/v1/khmer-years?from=2020&to=2030
// No database — calculated dynamically
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  // Range query
  if (from && to) {
    const data = getKhmerYearRange(parseInt(from), parseInt(to));
    return NextResponse.json({ data });
  }

  // Single year query
  const targetYear = year
    ? parseInt(year)
    : new Date().getFullYear();

  const data = getKhmerYearInfo(targetYear);
  return NextResponse.json({ data });
}