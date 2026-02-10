# Khmer Lunar Calendar - Admin Dashboard Full Guide (v2)
## Next.js + TypeScript + Neon PostgreSQL

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│  Ionic Angular App (Public - No Login)               │
│  ├── Fetch holidays from public API                  │
│  ├── Khmer year info (calculated in JS)              │
│  └── User reminders → device localStorage/SQLite     │
└────────────────────┬─────────────────────────────────┘
                     │ GET (public, no auth)
                     ▼
┌──────────────────────────────────────────────────────┐
│  Next.js Admin Dashboard + API                       │
│  ├── Public API: GET endpoints (no auth)             │
│  ├── Admin API: POST/PUT/DELETE (JWT auth)           │
│  ├── Admin Dashboard UI (auth required)              │
│  └── Khmer year utility (calculated, no DB)          │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│  Neon PostgreSQL                                     │
│  ├── admin_users                                     │
│  ├── holiday_types                                   │
│  ├── holidays                                        │
│  ├── holiday_dates                                   │
│  ├── khmer_lunar_months                              │
│  └── special_events                                  │
│  (No khmer_years table — calculated in code)         │
└──────────────────────────────────────────────────────┘
```

---

## Step 1: Setup Neon Database

1. Go to [https://neon.tech](https://neon.tech) and create an account
2. Create a new project (e.g., `khmer-calendar`)
3. Copy your connection string from **Connection Details**
4. Open the **SQL Editor** in Neon dashboard
5. Paste and run the `khmer_calendar_db_v2.sql` script (provided separately)

This creates 6 tables:

| Table | Purpose |
|-------|---------|
| `admin_users` | Admin accounts for managing data |
| `holiday_types` | Holiday categories (Public, Lunar, Buddhist, etc.) |
| `holidays` | Master holiday definitions |
| `holiday_dates` | Actual Gregorian dates per holiday per year |
| `khmer_lunar_months` | Reference: 12+1 Khmer month names |
| `special_events` | Non-holiday events (Thngai Sel, cultural) |

---

## Step 2: Create Next.js Project

```bash
npx create-next-app@latest khmer-calendar-admin --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd khmer-calendar-admin
```

Choose these options when prompted:
- ✅ TypeScript
- ✅ ESLint
- ✅ Tailwind CSS
- ✅ `src/` directory
- ✅ App Router
- ❌ Turbopack (optional)

---

## Step 3: Install Dependencies

```bash
# Database (Neon + Drizzle ORM)
npm install @neondatabase/serverless drizzle-orm
npm install -D drizzle-kit

# Auth (admin login)
npm install next-auth@beta @auth/drizzle-adapter bcryptjs
npm install -D @types/bcryptjs

# UI Components
npm install class-variance-authority clsx tailwind-merge lucide-react

# Form handling & validation
npm install react-hook-form @hookform/resolvers zod

# Date handling
npm install date-fns

# shadcn/ui (recommended for admin dashboard)
npx shadcn@latest init
```

When shadcn asks, choose:
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**

Add UI components:

```bash
npx shadcn@latest add button input label card table dialog select form toast badge tabs separator dropdown-menu calendar sheet
```

---

## Step 4: Environment Variables

Create `.env.local` in project root:

```env
# Neon Database (get from Neon dashboard → Connection Details)
DATABASE_URL="postgresql://username:password@ep-xxxxx.region.aws.neon.tech/khmer_calendar?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="generate-a-random-32-char-string-here"
NEXTAUTH_URL="http://localhost:3000"
```

> Generate secret: `openssl rand -base64 32`

---

## Step 5: Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx                  # Admin login page
│   ├── (dashboard)/
│   │   ├── layout.tsx                    # Dashboard layout with sidebar
│   │   ├── page.tsx                      # Dashboard overview
│   │   ├── holidays/
│   │   │   ├── page.tsx                  # List holidays
│   │   │   ├── new/page.tsx              # Create holiday
│   │   │   └── [id]/edit/page.tsx        # Edit holiday
│   │   ├── holiday-dates/
│   │   │   ├── page.tsx                  # Manage yearly dates
│   │   │   └── new/page.tsx              # Add date entry
│   │   ├── holiday-types/
│   │   │   └── page.tsx                  # Manage categories
│   │   └── special-events/
│   │       ├── page.tsx                  # List events
│   │       └── new/page.tsx              # Create event
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts    # NextAuth handler
│   │   └── v1/
│   │       ├── holidays/
│   │       │   ├── route.ts              # GET (public), POST (admin)
│   │       │   └── [id]/route.ts         # GET, PUT, DELETE
│   │       ├── holiday-dates/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── holiday-types/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── special-events/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── khmer-years/
│   │       │   └── route.ts              # GET only (calculated, no DB)
│   │       └── calendar/
│   │           └── route.ts              # GET - main public endpoint
│   └── layout.tsx                        # Root layout
├── components/
│   ├── ui/                               # shadcn (auto-generated)
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── breadcrumb.tsx
│   ├── holidays/
│   │   ├── holiday-form.tsx
│   │   ├── holiday-table.tsx
│   │   └── holiday-date-form.tsx
│   └── shared/
│       ├── data-table.tsx
│       ├── delete-dialog.tsx
│       └── loading-skeleton.tsx
├── db/
│   ├── index.ts                          # Neon connection
│   └── schema.ts                         # Drizzle schema
├── lib/
│   ├── auth.ts                           # NextAuth config
│   ├── khmer-year.ts                     # Khmer year calculator (no DB!)
│   ├── utils.ts                          # Utility functions
│   └── validations/
│       ├── holiday.ts                    # Zod schemas
│       ├── holiday-date.ts
│       └── special-event.ts
├── middleware.ts                          # Route protection
└── types/
    └── index.ts                          # Shared TypeScript types
```

---

## Step 6: Database Connection

Create `src/db/index.ts`:

```typescript
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

---

## Step 7: Drizzle Schema

Create `src/db/schema.ts`:

```typescript
import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  date,
  timestamp,
  pgEnum,
  serial,
  unique,
} from "drizzle-orm/pg-core";

// Enums
export const holidayRecurrenceType = pgEnum("holiday_recurrence_type", [
  "fixed",
  "lunar",
  "variable",
]);

export const holidayStatus = pgEnum("holiday_status", ["active", "inactive"]);

// Tables
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 50 }).unique().notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 100 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const holidayTypes = pgTable("holiday_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).unique().notNull(),
  nameKm: varchar("name_km", { length: 100 }),
  description: text("description"),
  colorCode: varchar("color_code", { length: 7 }).default("#FF0000"),
  icon: varchar("icon", { length: 50 }),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const holidays = pgTable("holidays", {
  id: uuid("id").primaryKey().defaultRandom(),
  holidayTypeId: uuid("holiday_type_id")
    .notNull()
    .references(() => holidayTypes.id),
  name: varchar("name", { length: 255 }).notNull(),
  nameKm: varchar("name_km", { length: 255 }),
  description: text("description"),
  descriptionKm: text("description_km"),
  recurrenceType: holidayRecurrenceType("recurrence_type")
    .notNull()
    .default("fixed"),
  fixedMonth: integer("fixed_month"),
  fixedDay: integer("fixed_day"),
  lunarMonth: integer("lunar_month"),
  lunarDay: integer("lunar_day"),
  lunarWaxing: boolean("lunar_waxing"),
  durationDays: integer("duration_days").default(1),
  isPublicHoliday: boolean("is_public_holiday").default(false),
  isBankHoliday: boolean("is_bank_holiday").default(false),
  status: holidayStatus("status").default("active"),
  createdBy: uuid("created_by").references(() => adminUsers.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const holidayDates = pgTable("holiday_dates", {
  id: uuid("id").primaryKey().defaultRandom(),
  holidayId: uuid("holiday_id")
    .notNull()
    .references(() => holidays.id, { onDelete: "cascade" }),
  year: integer("year").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  isConfirmed: boolean("is_confirmed").default(false),
  notes: text("notes"),
  createdBy: uuid("created_by").references(() => adminUsers.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const khmerLunarMonths = pgTable("khmer_lunar_months", {
  id: serial("id").primaryKey(),
  monthNumber: integer("month_number").unique().notNull(),
  name: varchar("name", { length: 50 }).notNull(),
  nameKm: varchar("name_km", { length: 50 }),
  description: text("description"),
});

export const specialEvents = pgTable("special_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  nameKm: varchar("name_km", { length: 255 }),
  description: text("description"),
  descriptionKm: text("description_km"),
  eventDate: date("event_date").notNull(),
  year: integer("year").notNull(),
  isBuddhistDay: boolean("is_buddhist_day").default(false),
  isRoyalEvent: boolean("is_royal_event").default(false),
  status: holidayStatus("status").default("active"),
  createdBy: uuid("created_by").references(() => adminUsers.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
```

---

## Step 8: Drizzle Config

Create `drizzle.config.ts` in project root:

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

---

## Step 9: Khmer Year Utility (Calculated — No DB)

Create `src/lib/khmer-year.ts`:

```typescript
interface KhmerYearInfo {
  gregorianYear: number;
  buddhistEra: number;
  animalYear: string;
  animalYearKm: string;
}

// 12-year animal zodiac cycle aligned to Gregorian year
const ANIMALS = [
  { en: "Year of the Monkey",  km: "ឆ្នាំវក" },     // index 0
  { en: "Year of the Rooster", km: "ឆ្នាំរកា" },     // index 1
  { en: "Year of the Dog",     km: "ឆ្នាំច" },       // index 2
  { en: "Year of the Pig",     km: "ឆ្នាំកុរ" },     // index 3
  { en: "Year of the Rat",     km: "ឆ្នាំជូត" },     // index 4
  { en: "Year of the Ox",      km: "ឆ្នាំឆ្លូវ" },    // index 5
  { en: "Year of the Tiger",   km: "ឆ្នាំខាល" },     // index 6
  { en: "Year of the Rabbit",  km: "ឆ្នាំថោះ" },     // index 7
  { en: "Year of the Dragon",  km: "ឆ្នាំរោង" },     // index 8
  { en: "Year of the Snake",   km: "ឆ្នាំម្សាញ់" },   // index 9
  { en: "Year of the Horse",   km: "ឆ្នាំみみី" },     // index 10
  { en: "Year of the Goat",    km: "ឆ្នាំមមែ" },     // index 11
];

/**
 * Calculate Khmer year info from any Gregorian year.
 * No database needed — pure calculation.
 *
 * Buddhist Era = Gregorian + 544
 * Animal cycle = Gregorian year % 12 (aligned so 2016 = Monkey)
 */
export function getKhmerYearInfo(gregorianYear: number): KhmerYearInfo {
  const buddhistEra = gregorianYear + 544;
  const animal = ANIMALS[gregorianYear % 12];

  return {
    gregorianYear,
    buddhistEra,
    animalYear: animal.en,
    animalYearKm: animal.km,
  };
}

/**
 * Get Khmer year info for a range of years.
 */
export function getKhmerYearRange(
  startYear: number,
  endYear: number
): KhmerYearInfo[] {
  const results: KhmerYearInfo[] = [];
  for (let year = startYear; year <= endYear; year++) {
    results.push(getKhmerYearInfo(year));
  }
  return results;
}
```

---

## Step 10: Auth Configuration

Create `src/lib/auth.ts`:

```typescript
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await db
          .select()
          .from(adminUsers)
          .where(eq(adminUsers.username, credentials.username as string))
          .limit(1);

        if (!user.length) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user[0].passwordHash
        );

        if (!isValid) return null;

        return {
          id: user[0].id,
          name: user[0].fullName,
          email: user[0].email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
```

Create `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

---

## Step 11: Middleware (Route Protection)

Create `src/middleware.ts`:

```typescript
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;

  // Dashboard pages that need auth
  const protectedPaths = [
    "/holidays",
    "/holiday-dates",
    "/holiday-types",
    "/special-events",
  ];
  const isOnDashboard =
    req.nextUrl.pathname === "/" ||
    protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path));

  // Non-GET API calls need auth (POST, PUT, DELETE)
  const isApiWrite =
    req.nextUrl.pathname.startsWith("/api/v1/") && req.method !== "GET";

  // Protect dashboard pages → redirect to login
  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Protect write API routes → return 401
  if (isApiWrite && !isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
```

---

## Step 12: API Routes

### 12a. Holidays CRUD — `src/app/api/v1/holidays/route.ts`

```typescript
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
```

### 12b. Holidays by ID — `src/app/api/v1/holidays/[id]/route.ts`

```typescript
import { db } from "@/db";
import { holidays } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/v1/holidays/:id — Public
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await db
    .select()
    .from(holidays)
    .where(eq(holidays.id, id))
    .limit(1);

  if (!result.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ data: result[0] });
}

// PUT /api/v1/holidays/:id — Admin only
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const updated = await db
    .update(holidays)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(holidays.id, id))
    .returning();

  if (!updated.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ data: updated[0] });
}

// DELETE /api/v1/holidays/:id — Admin only
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = await db
    .delete(holidays)
    .where(eq(holidays.id, id))
    .returning();

  if (!deleted.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Deleted successfully" });
}
```

### 12c. Holiday Dates — `src/app/api/v1/holiday-dates/route.ts`

```typescript
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
```

### 12d. Holiday Dates by ID — `src/app/api/v1/holiday-dates/[id]/route.ts`

```typescript
import { db } from "@/db";
import { holidayDates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const updated = await db
    .update(holidayDates)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(holidayDates.id, id))
    .returning();

  if (!updated.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ data: updated[0] });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = await db
    .delete(holidayDates)
    .where(eq(holidayDates.id, id))
    .returning();

  if (!deleted.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Deleted successfully" });
}
```

### 12e. Holiday Types — `src/app/api/v1/holiday-types/route.ts`

```typescript
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
```

### 12f. Holiday Types by ID — `src/app/api/v1/holiday-types/[id]/route.ts`

```typescript
import { db } from "@/db";
import { holidayTypes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const updated = await db
    .update(holidayTypes)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(holidayTypes.id, id))
    .returning();

  if (!updated.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ data: updated[0] });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = await db
    .delete(holidayTypes)
    .where(eq(holidayTypes.id, id))
    .returning();

  if (!deleted.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Deleted successfully" });
}
```

### 12g. Special Events — `src/app/api/v1/special-events/route.ts`

```typescript
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
```

### 12h. Special Events by ID — `src/app/api/v1/special-events/[id]/route.ts`

```typescript
import { db } from "@/db";
import { specialEvents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const updated = await db
    .update(specialEvents)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(specialEvents.id, id))
    .returning();

  if (!updated.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ data: updated[0] });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = await db
    .delete(specialEvents)
    .where(eq(specialEvents.id, id))
    .returning();

  if (!deleted.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Deleted successfully" });
}
```

### 12i. Khmer Years — `src/app/api/v1/khmer-years/route.ts`

```typescript
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
```

### 12j. Public Calendar — `src/app/api/v1/calendar/route.ts`

This is the **main endpoint your Ionic app will call**:

```typescript
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
```

---

## Step 13: CORS Configuration

Update `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/api/v1/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

## Step 14: Zod Validation Schemas

Create `src/lib/validations/holiday.ts`:

```typescript
import { z } from "zod";

export const createHolidaySchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  nameKm: z.string().max(255).optional(),
  holidayTypeId: z.string().uuid("Invalid holiday type"),
  description: z.string().optional(),
  descriptionKm: z.string().optional(),
  recurrenceType: z.enum(["fixed", "lunar", "variable"]),
  fixedMonth: z.number().min(1).max(12).optional(),
  fixedDay: z.number().min(1).max(31).optional(),
  lunarMonth: z.number().min(1).max(13).optional(),
  lunarDay: z.number().min(1).max(30).optional(),
  lunarWaxing: z.boolean().optional(),
  durationDays: z.number().min(1).default(1),
  isPublicHoliday: z.boolean().default(false),
  isBankHoliday: z.boolean().default(false),
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
```

---

## Step 15: Seed Admin User

Create `scripts/seed-admin.ts`:

```typescript
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  const sql = neon(process.env.DATABASE_URL!);

  const passwordHash = await bcrypt.hash("your-secure-password", 12);

  await sql`
    INSERT INTO admin_users (username, email, password_hash, full_name)
    VALUES ('admin', 'admin@khmer-calendar.app', ${passwordHash}, 'Admin')
    ON CONFLICT (username) DO UPDATE SET password_hash = ${passwordHash}
  `;

  console.log("✅ Admin user seeded successfully");
  console.log("   Username: admin");
  console.log("   Password: your-secure-password");
}

seedAdmin().catch(console.error);
```

Add to `package.json` scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "seed:admin": "npx tsx scripts/seed-admin.ts"
  }
}
```

Install tsx and run:

```bash
npm install -D tsx
npm run seed:admin
```

---

## Step 16: Run & Test

```bash
npm run dev
```

Test your endpoints:

```bash
# Public endpoints (no auth needed)
curl http://localhost:3000/api/v1/holidays
curl http://localhost:3000/api/v1/holiday-types
curl http://localhost:3000/api/v1/calendar?year=2026
curl http://localhost:3000/api/v1/khmer-years?year=2026
curl http://localhost:3000/api/v1/khmer-years?from=2020&to=2030
curl http://localhost:3000/api/v1/special-events?year=2026

# Admin endpoints (need auth — will return 401 without login)
curl -X POST http://localhost:3000/api/v1/holidays \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Holiday", "holidayTypeId": "...", "recurrenceType": "fixed"}'
```

---

## API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| **GET** | `/api/v1/calendar?year=2026` | Public | **Main endpoint** — combined data for Ionic app |
| GET | `/api/v1/holidays` | Public | List all holidays |
| GET | `/api/v1/holidays/:id` | Public | Get single holiday |
| POST | `/api/v1/holidays` | Admin | Create holiday |
| PUT | `/api/v1/holidays/:id` | Admin | Update holiday |
| DELETE | `/api/v1/holidays/:id` | Admin | Delete holiday |
| GET | `/api/v1/holiday-dates?year=2026` | Public | Get dates for a year |
| POST | `/api/v1/holiday-dates` | Admin | Add date entry |
| PUT | `/api/v1/holiday-dates/:id` | Admin | Update date |
| DELETE | `/api/v1/holiday-dates/:id` | Admin | Delete date |
| GET | `/api/v1/holiday-types` | Public | List categories |
| POST | `/api/v1/holiday-types` | Admin | Create category |
| PUT | `/api/v1/holiday-types/:id` | Admin | Update category |
| DELETE | `/api/v1/holiday-types/:id` | Admin | Delete category |
| GET | `/api/v1/special-events?year=2026` | Public | List events |
| POST | `/api/v1/special-events` | Admin | Create event |
| PUT | `/api/v1/special-events/:id` | Admin | Update event |
| DELETE | `/api/v1/special-events/:id` | Admin | Delete event |
| GET | `/api/v1/khmer-years?year=2026` | Public | Khmer year info (calculated) |
| GET | `/api/v1/khmer-years?from=2020&to=2030` | Public | Year range (calculated) |

---

## Next Steps (Build the Dashboard UI)

Now that your API is complete, build the admin dashboard pages:

1. **Login page** — `/login` with username/password form
2. **Dashboard layout** — Sidebar with navigation links
3. **Holidays page** — Table listing all holidays + create/edit forms
4. **Holiday Dates page** — Manage yearly date entries per holiday
5. **Holiday Types page** — Manage categories
6. **Special Events page** — Manage events
7. **Deploy to Vercel** — connect GitHub repo, add env variables

Would you like me to help build any of these dashboard pages next?
