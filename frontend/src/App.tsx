import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider.tsx";
import { AppRoutes } from "./components";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}