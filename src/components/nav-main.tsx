"use client"

import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        Main Application
      </SidebarGroupLabel>
      <SidebarMenu className="gap-1.5">
        {items.map((item) => {
          const isActive = pathname === item.url

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-6 transition-all duration-300 group",
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-100/50 dark:bg-blue-500/10 dark:text-blue-400 dark:shadow-none"
                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-500 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-blue-300",
                )}
              >
                <Link href={item.url} className="hover:text-blue-500">
                  {/* The "Glow" indicator on the left */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-full w-0.5 -translate-y-1/2 rounded-r-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  )}

                  {item.icon && (
                    <item.icon className={cn(
                      "size-5 transition-all duration-300 group-hover:scale-110",
                      isActive ? "text-blue-500" : "text-slate-400 group-hover:text-blue-500"
                    )} />
                  )}

                  <span className={cn(
                    "text-[14px] transition-colors",
                    isActive ? "font-bold" : "font-medium"
                  )}>
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}