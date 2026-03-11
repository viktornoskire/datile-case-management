import { Routes, Route } from "react-router-dom";
import { Errands, Reports, Customers, Users, Settings, PingPage } from "../pages";
import CreateErrandPage from "../pages/CreateErrandPage";

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<div>HELLO</div>} />
            <Route path="/ping" element={<PingPage/>} />
            <Route path="/errands" element={<Errands/>}/>
            <Route path="/errands/new" element={<CreateErrandPage />} />
            <Route path="/reports" element={<Reports/>} />
            <Route path="/customers" element={<Customers/>} />
            <Route path="/users" element={<Users/>} />
            <Route path="/settings" element={<Settings/>} />
        </Routes>
    )
}