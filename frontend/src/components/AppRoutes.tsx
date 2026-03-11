import { Routes, Route, Navigate } from "react-router-dom";
import { Errands, Reports, Customers, Users, Settings, PingPage, Login } from "../pages";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/" element={<Navigate to="/errands"/>} />
            <Route path="/ping" element={<PingPage/>} />
            <Route path="/errands" element={<Errands/>}/>
            <Route path="/reports" element={<Reports/>} />
            <Route path="/customers" element={<Customers/>} />
            <Route path="/users" element={<Users/>} />
            <Route path="/settings" element={<Settings/>} />
        </Routes>
    )
}