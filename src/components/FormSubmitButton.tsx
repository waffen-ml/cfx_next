"use client";

import { useFormStatus } from "react-dom";

export default function FormSubmitButton({
    children,
}: {
    children: React.ReactNode;
}) {
    const { pending } = useFormStatus();

    return (
        <div>
            <button type="submit" disabled={pending}>
                {children}
            </button>
            {pending && <p>Pending...</p>}
        </div>
    );
}
