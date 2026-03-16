import { useState } from "react";
import type { Role } from "../types/users.ts";
import { apiClient } from "../services/apiClient.ts";
import * as React from "react";

type Password = {
    password: string;
};

type User = {
    id: number;
    name: string;
    email: string;
    role: Role;
}

export default function NewUserForm({
                                        setDrawerOpen,
                                    }: {
    setDrawerOpen: (open: boolean) => void;
}) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [selectedRole, setSelectedRole] = useState<Role>("USER");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function generatePassword() {
        const randomPassword = await apiClient.get<Password>("/api/users/password");
        setPassword(randomPassword.password);
    }

    async function saveUser(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!password.trim() || !name.trim() || !email.trim()) {
            setError("Ange giltig information...");
            return;
        }

        setError(null);

        try {
            await apiClient.post<User>("/api/users", {
                name: name.trim(),
                email: email.trim(),
                role: selectedRole,
                password: password.trim(),
            });

            setDrawerOpen(false);

        } catch (error: unknown) {

            if (error instanceof Error) {
                setError("Användare finns redan...");
            } else {
                setError("Något gick fel...");
            }

        }
    }

    return (
        <div className="w-full sm:w-[380px] bg-white border-l border-slate-200 shadow-xl p-6 overflow-y-auto">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">
                    Ny användare
                </h2>

                <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="text-slate-500 hover:text-slate-800 text-lg"
                >
                    ✕
                </button>
            </div>

            {/* FORM */}
            <form
                className="space-y-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    saveUser(e);
                }}
                onChange={() => {
                }}
            >

                {/* NAME */}
                <p className={`text-red-600 font-semibold font-poppins text-xs`} >{error}</p>
                <div>
                    <label className="text-sm text-slate-600">
                        Namn
                    </label>
                    <input
                        type="text"
                        className="mt-1 w-full rounded-full border border-[#d2d2d2] px-3 py-2 text-sm"
                        onChange={(e) => {
                            setError(null);
                            setName(e.target.value)
                        }}
                    />
                </div>

                {/* EMAIL */}
                <div>
                    <label className="text-sm text-slate-600">
                        E-postadress
                    </label>
                    <input
                        type="email"
                        className="mt-1 w-full rounded-full border border-[#d2d2d2] px-3 py-2 text-sm"
                        onChange={(e) => {
                            setError(null);
                            setEmail(e.target.value)
                        }}
                    />
                </div>

                {/* PASSWORD */}
                <div>
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-slate-600">
                            Lösenord
                        </label>

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-xs text-slate-500 hover:text-slate-700"
                        >
                            {showPassword ? "Dölj lösenord" : "Visa lösenord"}
                        </button>
                    </div>

                    <div className="mt-1 flex gap-2">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="flex-1 rounded-full border border-[#d2d2d2] px-3 py-2 text-sm"
                            value={password}
                            onChange={(e) => {
                                setError(null);
                                setPassword(e.target.value)
                            }}
                        />

                        <button
                            type="button"
                            onClick={generatePassword}
                            className="rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 whitespace-nowrap"
                        >
                            Generera lösenord
                        </button>
                    </div>
                </div>

                {/* ROLE */}
                <div>
                    <label className="text-sm text-slate-600">
                        Roll
                    </label>

                    <div className="flex gap-2 mt-2">

                        <button
                            type="button"
                            onClick={() => setSelectedRole("USER")}
                            className={`px-3 py-1 rounded-full text-sm ${
                                selectedRole === "USER"
                                    ? "bg-slate-900 text-white"
                                    : "bg-slate-200"
                            }`}
                        >
                            User
                        </button>

                        <button
                            type="button"
                            onClick={() => setSelectedRole("ADMIN")}
                            className={`px-3 py-1 rounded-full text-sm ${
                                selectedRole === "ADMIN"
                                    ? "bg-purple-600 text-white"
                                    : "bg-purple-100 text-purple-700"
                            }`}
                        >
                            Admin
                        </button>

                    </div>
                </div>

                {/* SAVE BUTTON */}
                <button
                    type="submit"
                    className="mt-6 w-full rounded-full bg-[#99D0B6] py-2 text-white font-semibold hover:bg-[#85bfa7]"
                >
                    Spara
                </button>

            </form>
        </div>
    );
}