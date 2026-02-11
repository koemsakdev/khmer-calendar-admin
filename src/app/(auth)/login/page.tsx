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

import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Loader } from "lucide-react";
import { signIn } from "next-auth/react";

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
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
            toast({ title: "Login Failed", description: "Invalid credentials", variant: "destructive" });
            setLoading(false);
        } else {
            router.push("/");
            router.refresh();
        }
    }

    return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <Card className="w-full max-w-md shadow-lg">
                <Image
                    src={"/calendar-khmer-logo.png"}
                    alt="Admin Logo"
                    width={100}
                    height={100}
                    className="m-auto"
                />
                <CardHeader className="space-y-1">
                    <CardTitle className="text-4xl font-medium text-center moul-regular">ប្រតិទិន កូនខ្មែរ</CardTitle>
                    <CardDescription className="text-center text-lg">បញ្ចូលព័ត៌មានសម្ងាត់របស់អ្នក ដើម្បីគ្រប់គ្រងប្រតិទិន</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="form-submit" className="space-y-2">
                        <FieldGroup>
                            <Controller
                                name="username"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="username">
                                            Username
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            disabled={loading}
                                            id="username"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter your username"
                                            autoComplete="off"
                                            className="focus-visible:ring-0 py-5 text-base border-2 focus-visible:border-stone-300 rounded-sm selection:bg-blue-500"
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
                                        <FieldLabel htmlFor="form-password">
                                            Password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            disabled={loading}
                                            type="password"
                                            id="form-password"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter your password"
                                            autoComplete="off"
                                            className="focus-visible:ring-0 py-5 text-base border-2 focus-visible:border-stone-300 rounded-sm selection:bg-blue-500"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <Field orientation="horizontal">
                        <Button type="submit" disabled={loading} className="cursor-pointer w-full rounded-sm py-5 bg-blue-500 hover:bg-blue-600" form="form-submit">
                            {loading ?
                                (<Loader className="animate-spin" />) : "LOGIN"
                            }
                        </Button>
                    </Field>
                </CardFooter>
            </Card>
        </div>
    );
}

export default LoginPage
