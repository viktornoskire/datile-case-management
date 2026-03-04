import { useEffect, useState } from "react";
import { apiClient } from "./services/apiClient.ts";
import { ApiError } from "./services/apiError.ts";

/* This is the React component that renders as our start page */

export default function App() {
// UI state: response payload (pretty-printed) and error message
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

    return (
        <div className="p-6 font-sans">
            <h1>Frontend smoke test</h1>

            <p>
                API Base URL: <code>{import.meta.env.VITE_API_BASE_URL}</code>
            </p>

            <h2>Response</h2>
            <pre>{data}</pre>

            {error && (
                <>
                    <h2>Error</h2>
                    <pre>{error}</pre>
                </>
            )}
        </div>
    );
}