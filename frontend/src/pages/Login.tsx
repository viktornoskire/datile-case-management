import { apiClient } from "../services/apiClient.ts";
import * as React from "react";

export default function Login() {

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        try {
            await apiClient.post("/api/auth/login", { username, password });
        } catch (err) {
            console.error("Login failed", err);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input name="username" placeholder="Username" required />
            <input name="password" type="password" placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
    );
}