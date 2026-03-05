import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Errands, Reports, Customers, Users, Settings, PingPage } from "./pages";

export default function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<div>HELLO</div>} />
                <Route path="/ping" element={<PingPage/>} />
                <Route path="/errands" element={<Errands/>} />
                <Route path="/reports" element={<Reports/>} />
                <Route path="/customers" element={<Customers/>} />
                <Route path="/users" element={<Users/>} />
                <Route path="/settings" element={<Settings/>} />
            </Routes>
        </BrowserRouter>
    );
}