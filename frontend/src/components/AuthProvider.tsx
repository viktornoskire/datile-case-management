import { createContext, useEffect, useState } from "react";
import { apiClient } from "../services/apiClient";

type AuthContextType = {
    name: string | null;
    user: string | null;
    role: "ADMIN" | "USER" | null
    loading: boolean;
    refreshAuth: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [name, setName] = useState<string | null>(null);
    const [user, setUser] = useState<string | null>(null);
    const [role, setRole] = useState<"ADMIN" | "USER" | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshAuth = async () => {
        setLoading(true);

        try {
            const data = await apiClient.get<{ name: string; email: string; role: "ADMIN" | "USER" }>("/api/auth/me");
            setName(data.name);
            setUser(data.email);
            setRole(data.role);
        } catch (err) {
            setName(null);
            setUser(null);
            setRole(null);
        }

        setLoading(false);
    };

    useEffect(() => {
        refreshAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ name, user, role, loading, refreshAuth }}>
            {children}
        </AuthContext.Provider>
    );
}