"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";
import {
    register as registerAction,
    RegisterFields,
} from "@/lib/auth/auth.actions";
import FormSubmitButton from "@/components/FormSubmitButton";

export default function RegisterForm() {
    const [state, formAction] = useActionState(registerAction, null);
    const { register } = useForm<RegisterFields>();

    return (
        <form action={formAction} className="flex flex-col gap-1 max-w-[300px]">
            <input className="shadow-sm" type="text" {...register("name")} />
            <input className="shadow-sm" type="text" {...register("tag")} />
            <input className="shadow-sm" type="text" {...register("email")} />
            <input
                className="shadow-sm"
                type="password"
                {...register("password")}
            />
            <input
                className="shadow-sm"
                type="password"
                {...register("confirmPassword")}
            />
            <FormSubmitButton>Send</FormSubmitButton>
        </form>
    );
}
