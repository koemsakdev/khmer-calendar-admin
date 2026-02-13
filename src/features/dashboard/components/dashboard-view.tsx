"use client";

import { useMemo } from "react";
import { useSetBreadcrumb } from "@/hooks/use-breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Star, ShieldAlert, Flag, Sparkles, CheckCircle2, AlertCircle, Settings } from "lucide-react";
import { Stat } from "../types";
import Image from "next/image";

const iconMap = {
  calendar: Calendar,
  star: Star,
  shield: ShieldAlert,
};

const currentYear = 2026;
const sloganInfo = {
  enDateInfo: "Friday 13, កុម្ភះ, Februlary, 2026",
  khDateInfo: "ថ្ងៃ សុក្រ ទី ១៣, មាឃ - ផល្គុន ឆ្នាំម្សាញ់ ព.ស. ២៥៦៩"
};

const states = {
  activeHolidays: 24,
  specialEvents: 8,
  types: 5,
  datesSet: 22, // 22 out of 24 set
};

export function DashboardView({ stats }: { stats: Stat[] }) {

  const breadcrumb = useMemo(() => [
    { label: "Overview" },
  ], []);
  const completionPercentage = Math.round((states.datesSet / states.activeHolidays) * 100);

  useSetBreadcrumb(breadcrumb);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Overview for Gregorian Year {currentYear}</p>
      </div>

      <div className="rounded-xl bg-blue-50 px-6 py-4 text-white shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-linear-to-l from-blue-600/20 to-transparent pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between relative z-10">
          <div className="space-y-2">
            <p className="text-blue-500 text-sm font-semibold uppercase tracking-wider">Current Khmer Year</p>
            <div className="flex flex-col gap-y-2">
              <h2 className="text-3xl font-bold text-blue-500">{sloganInfo.enDateInfo}</h2>
              <h2 className="text-2xl text-blue-400 font-medium">{sloganInfo.khDateInfo}</h2>
            </div>
          </div>
          <div className="h-30 w-30 rounded-xl flex items-center justify-between">
            <Image
              src={'/years/tiger.jpg'}
              alt="Year of animal"
              width={500}
              height={500}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = iconMap[stat.icon];

          return (
            <Card key={stat.title}>
              <CardHeader className="flex justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div> */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500">Active Holidays</h3>
            <Flag className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 text-3xl font-bold text-blue-600">{states.activeHolidays}</div>
          <p className="text-xs text-slate-500 mt-1">Master definitions</p>
        </Card>

        <Card className="p-6 gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500">Special Events</h3>
            <Sparkles className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 text-3xl font-bold text-blue-600">{states.specialEvents}</div>
          <p className="text-xs text-slate-500 mt-1">Scheduled for {currentYear}</p>
        </Card>

        <Card className="p-6 gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500">Data Readiness</h3>
            {completionPercentage >= 100 ?
              <CheckCircle2 className="h-4 w-4 text-green-500" /> :
              <AlertCircle className="h-4 w-4 text-amber-500" />
            }
          </div>
          <div className="mt-2 text-3xl font-bold text-blue-600">{completionPercentage}%</div>
          <p className="text-xs text-slate-500 mt-1">
            {states.datesSet}/{states.activeHolidays} dates set for {currentYear}
          </p>
          {/* Progress Bar */}
          <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-blue-500" style={{ width: `${completionPercentage}%` }}></div>
          </div>
        </Card>

        <Card className="p-6 gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500">Holiday Types</h3>
            <Settings className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 text-3xl font-bold text-blue-600">{states.types}</div>
          <p className="text-xs text-slate-500 mt-1">Categories defined</p>
        </Card>
      </div>
    </div>
  );
}
