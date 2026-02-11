import { z } from "zod";


export const createHolidaySchema = z.object({
  name: z.string().min(1),
  holidayTypeId: z.string().min(1),
  recurrenceType: z.enum(["fixed", "lunar", "variable"]),
  durationDays: z.coerce.number().min(1),
  isPublicHoliday: z.boolean(),
  isBankHoliday: z.boolean(),
  nameKm: z.string().optional(),
  description: z.string().optional(),
  descriptionKm: z.string().optional(),
  lunarWaxing: z.boolean().optional(),
});

export const createHolidayDateSchema = z.object({
  holidayId: z.string().uuid("Invalid holiday"),
  year: z.number().min(2000).max(2100),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),
  isConfirmed: z.boolean().default(false),
  notes: z.string().optional(),
});

export const createSpecialEventSchema = z.object({
  name: z.string().min(1).max(255),
  nameKm: z.string().max(255).optional(),
  description: z.string().optional(),
  descriptionKm: z.string().optional(),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  year: z.number().min(2000).max(2100),
  isBuddhistDay: z.boolean().default(false),
  isRoyalEvent: z.boolean().default(false),
});