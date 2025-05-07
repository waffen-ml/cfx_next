"use client";

import { createNewPost } from "@/lib/post/actions";
import FormSubmitButton from "@/components/FormSubmitButton";

export default function NewPostForm() {
    return (
        <form action={createNewPost}>
            <textarea name="body" placeholder="your post text"></textarea>
            <FormSubmitButton>Post</FormSubmitButton>
        </form>
    );
}
