"use server"
import { revalidatePath } from 'next/cache';

export const submitTodo = async (prevState: any, formData: FormData) => {
    
    const message = formData.get("message");

    if (!message || message.toString().length < 5) {
        console.log("error:", message);
        return { error: "too short" }
    }
    console.log("message:", formData);
    await fetch("http://localhost:3000/api/todo", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ "message": message }),
    })
    console.log("running at server..");

    revalidatePath("/");
    return { error: null }
}

// Reset
export const resetTodo = async () => {
    await fetch("http://localhost:3000/api/todo/?action=reset");
    revalidatePath("/");
}