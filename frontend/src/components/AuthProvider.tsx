import { createContext, useEffect, useState } from "react";
import { apiClient } from "../services/apiClient";

type AuthContextType = {
    user: string | null;
    role: "ADMIN" | "USER" | null
    loading: boolean;
    refreshAuth: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<string | null>(null);
    const [role, setRole] = useState<"ADMIN" | "USER" | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshAuth = async () => {
        setLoading(true);

        try {
            const data = await apiClient.get<{ email: string; role: "ADMIN" | "USER" }>("/api/auth/me");
            setUser(data.email);
            setRole(data.role);
        } catch (err) {
            setUser(null);
            setRole(null);
        }

        setLoading(false);
    };

    useEffect(() => {
        refreshAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, role, loading, refreshAuth }}>
            {children}
        </AuthContext.Provider>
    );
}