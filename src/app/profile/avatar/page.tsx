"use client";

import FormSubmitButton from "@/components/FormSubmitButton";
import { useActionState } from "react";
import { setAvatar } from "@/actions/profile.actions";

export default function Avatar() {
    const [state, formAction] = useActionState(setAvatar, null);

    const formErrors = state?.errors ?? [];

    // accept = "image/png,image/jpg,image/jpeg";

    return (
        <>
            <h1>Set avatar</h1>
            <form action={formAction}>
                <input type="file" multiple={false} name="avatar" />
                {formErrors.map((err, i) => (
                    <p className="text-red-600" key={i}>
                        {err}
                    </p>
                ))}
                <FormSubmitButton>Set</FormSubmitButton>
            </form>
        </>
    );
}
