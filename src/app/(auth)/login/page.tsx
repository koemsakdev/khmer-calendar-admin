"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { authSchema } from "@/lib/validations/auth";
import Image from "next/image";
import { cn } from "@/lib/utils";

import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Loader, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof authSchema>>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof authSchema>) {
        setLoading(true);
        const result = await signIn("credentials", {
            username: data.username,
            password: data.password,
            redirect: false,
        });

        if (result?.error) {
            toast({ 
                title: "សូមអធ្យាស្រ័យ", 
                description: "មិនមានព័តមានរបស់អ្នកនៅក្នុងប្រព័ន្ធទេ! សូមព្យាយាមម្ដងទៀត។", 
                variant: "destructive" 
            });
            setLoading(false);
        } else {
            toast({ 
                title: "អបអរសារទរ", 
                description: "អ្នកបានចូលក្នុងប្រព័ន្ទ ប្រតិទិនកូនខ្មែរ បានដោយជោគជ័យ", 
                variant: "success" 
            });
            router.push("/");
            router.refresh();
        }
    }

    return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <Card className="w-full max-w-md shadow-lg border-none rounded-2xl">
                <div className="pt-8">
                    <Image
                        src={"/calendar-khmer-logo.png"}
                        alt="Admin Logo"
                        width={100}
                        height={100}
                        className="m-auto"
                    />
                </div>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-4xl font-medium text-center moul-regular">ប្រតិទិន កូនខ្មែរ</CardTitle>
                    <CardDescription className="text-center text-lg">បញ្ចូលព័ត៌មានសម្ងាត់របស់អ្នក ដើម្បីគ្រប់គ្រងប្រតិទិន</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="form-submit" className="space-y-4">
                        <FieldGroup>
                            <Controller
                                name="username"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="username">Username</FieldLabel>
                                        <Input
                                            {...field}
                                            disabled={loading}
                                            id="username"
                                            placeholder="Enter your username"
                                            autoComplete="off"
                                            className="focus-visible:ring-0 py-6 text-base border-2 focus-visible:border-blue-300 rounded-xl selection:bg-blue-500"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-password">Password</FieldLabel>
                                        <div className="relative group">
                                            <Input
                                                {...field}
                                                disabled={loading}
                                                type={showPassword ? "text" : "password"}
                                                id="form-password"
                                                placeholder="Enter your password"
                                                autoComplete="off"
                                                className={cn(
                                                    "focus-visible:ring-0 py-6 text-base border-2 focus-visible:border-blue-300 rounded-xl selection:bg-blue-500 pr-12",
                                                    !showPassword && "font-sans tracking-widest"
                                                )}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                disabled={loading}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-500 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="size-5" />
                                                ) : (
                                                    <Eye className="size-5" />
                                                )}
                                            </button>
                                        </div>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter className="pb-8">
                    <Button 
                        type="submit" 
                        disabled={loading} 
                        className="cursor-pointer w-full rounded-xl py-6 bg-blue-500 hover:bg-blue-600 shadow-md shadow-blue-200 transition-all font-bold text-lg" 
                        form="form-submit"
                    >
                        {loading ? (<Loader className="animate-spin" />) : "ចូលប្រើប្រាស់"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default LoginPage;