import { db } from "@/db";
import { holidays, holidayDates, specialEvents } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Star, ShieldAlert } from "lucide-react";

export default async function DashboardPage() {
  // Fetch stats from Neon DB
  const [holidayCount] = await db.select({ value: count() }).from(holidays);
  const [eventCount] = await db.select({ value: count() }).from(specialEvents);
  const [unconfirmedDates] = await db
    .select({ value: count() })
    .from(holidayDates)
    .where(eq(holidayDates.isConfirmed, false));

  const stats = [
    { title: "Total Holidays", value: holidayCount.value, icon: Calendar },
    { title: "Special Events", value: eventCount.value, icon: Star },
    { title: "Pending Confirmation", value: unconfirmedDates.value, icon: ShieldAlert },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Action: Recently Added or Year Selector could go here */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader><CardTitle>System Status</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Connected to Neon PostgreSQL. All API v1 endpoints are active.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}