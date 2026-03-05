import { useEffect, useState } from "react";
import { apiClient } from "../services/apiClient.ts";
import { ApiError } from "../services/apiError.ts";

export function usePing() {
    const [data, setData] = useState<string>("Not called yet");
    const [error, setError] = useState<string>("");

    // Smoke test page that displays JSON or readable error
    useEffect(() => {
        const run = async (): Promise<void> => {
            try {
                // Clear any previous error before making a new request
                setError("");

                // GET /api/ping -> we don't care about the exact response shape yet
                const res = await apiClient.get<unknown>("/api/ping");

                // Pretty-print JSON so it's readable in <pre>
                setData(JSON.stringify(res, null, 2));
            } catch (e) {

                // Network errors, parsing errors, etc.
                if (e instanceof ApiError) {
                    setError(
                        `API ${e.status}: ${e.message}\n${JSON.stringify(e.body, null, 2)}`
                    );
                } else if (e instanceof Error) {
                    setError(e.message);
                } else {
                    setError("Unknown error");
                }
            }
        };

        run();
    }, []);
    return { data, error };
}