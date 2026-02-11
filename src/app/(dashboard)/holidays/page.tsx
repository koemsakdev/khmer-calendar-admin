import { db } from "@/db";
import { holidays, holidayTypes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function HolidaysPage() {
  const data = await db
    .select({
      id: holidays.id,
      name: holidays.name,
      nameKm: holidays.nameKm,
      type: holidayTypes.name,
      recurrence: holidays.recurrenceType,
      isPublic: holidays.isPublicHoliday,
    })
    .from(holidays)
    .leftJoin(holidayTypes, eq(holidays.holidayTypeId, holidayTypes.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Holidays</h1>
        <Link href="/holidays/new">
          <Button><Plus className="mr-2 h-4 w-4" /> Add Holiday</Button>
        </Link>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>English Name</TableHead>
              <TableHead>Khmer Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Recurrence</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((holiday) => (
              <TableRow key={holiday.id}>
                <TableCell className="font-medium">{holiday.name}</TableCell>
                <TableCell className="font-khmer">{holiday.nameKm}</TableCell>
                <TableCell>{holiday.type}</TableCell>
                <TableCell className="capitalize">{holiday.recurrence}</TableCell>
                <TableCell>
                  {holiday.isPublic ? <Badge>Public</Badge> : <Badge variant="outline">Local</Badge>}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/holidays/${holiday.id}/edit`}>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}