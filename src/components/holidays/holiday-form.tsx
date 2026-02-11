"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createHolidaySchema } from "@/lib/validations/holiday";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type HolidayFormValues = z.infer<typeof createHolidaySchema>;

export function HolidayForm({ initialData, types }: { initialData?: any; types: any[] }) {

    const form = useForm({
        resolver: zodResolver(createHolidaySchema),
        defaultValues: {
            name: "",
            holidayTypeId: "",
            recurrenceType: "fixed",
            durationDays: 1,
            isPublicHoliday: false,
            isBankHoliday: false,
            nameKm: "",
            description: "",
            descriptionKm: "",
            lunarWaxing: false,
        },
    });

    async function onSubmit(values: HolidayFormValues) {
        const url = initialData ? `/api/v1/holidays/${initialData.id}` : "/api/v1/holidays";
        const method = initialData ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });

        if (response.ok) {
            window.location.href = "/holidays";
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg border">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>English Name</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="nameKm"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Khmer Name</FormLabel>
                                <FormControl><Input {...field} className="font-khmer" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="holidayTypeId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {types.map((t) => (
                                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex items-center gap-8 p-4 border rounded-md">
                    <FormField
                        control={form.control}
                        name="isPublicHoliday"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center gap-2 space-y-0">
                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <FormLabel>Public Holiday</FormLabel>
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="w-full">Save Holiday</Button>
            </form>
        </Form>
    );
}