"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Calendar, CalendarDays, List, Star, LayoutDashboard, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const menuItems = [
    { name: "Overview", href: "/", icon: LayoutDashboard },
    { name: "Holidays", href: "/holidays", icon: Calendar },
    { name: "Yearly Dates", href: "/holiday-dates", icon: CalendarDays },
    { name: "Categories", href: "/holiday-types", icon: List },
    { name: "Special Events", href: "/special-events", icon: Star },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col border-r bg-white">
            <div className="p-6 font-bold text-xl text-primary">Admin Panel</div>
            <nav className="flex-1 space-y-1 px-4">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            pathname === item.href ? "bg-slate-100 text-primary" : "text-slate-600 hover:bg-slate-50"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                    </Link>
                ))}
            </nav>
            <div className="border-t p-4">
                <button
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </div>
        </div>
    );
}