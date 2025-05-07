"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { login, LoginFields } from "@/lib/auth/actions";
import FormSubmitButton from "@/components/FormSubmitButton";
import Link from "next/link";

export default function LoginForm() {
    const [state, loginAction] = useActionState(login, null);
    const { register } = useForm<LoginFields>();

    return (
        <form
            action={loginAction}
            className="flex flex-col gap-2 max-w-[300px] p-2 bg-gray-300"
        >
            <input type="text" {...register("tag")} />
            <input type="password" {...register("password")} />
            <Link href="/auth/register">I don't have an account</Link>
            <FormSubmitButton>Send</FormSubmitButton>
        </form>
    );
}
