"use client"

import * as React from "react"
import {
  AudioWaveform,
  Calendar,
  CalendarDays,
  Command,
  GalleryVerticalEnd,
  LayoutDashboard,
  List,
  Star,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"


const data = {
  user: {
    name: "Supper Admin",
    email: "koemsak.mean@gmail.com",
    avatar: "/image.png",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Overview",
      url: "/",
      icon: LayoutDashboard
    },
    {
      title: "Holidays",
      url: "/holidays",
      icon: Calendar
    },
    {
      title: "Yearly Dates",
      url: "/holiday-dates",
      icon: CalendarDays
    },
    {
      title: "Categories",
      url: "/holiday-types",
      icon: List
    },
    {
      title: "Special Events",
      url: "/special-events",
      icon: Star
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
