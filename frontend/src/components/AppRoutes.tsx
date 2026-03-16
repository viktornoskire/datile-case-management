import { Routes, Route, Navigate } from "react-router-dom";
import { Errands, Reports, Customers, Users, Settings, PingPage, Login, CreateErrandPage} from "../pages";
import { ProtectedRoutes } from "./ProtectedRoutes.tsx";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login/>} />
            <Route element={<ProtectedRoutes/>} >
                <Route path="/" element={<Navigate to="/errands"/>} />
                <Route path="/ping" element={<PingPage/>} />
                <Route path="/errands" element={<Errands/>}/>
                <Route path="/errands/new" element={<CreateErrandPage />} />
                <Route path="/reports" element={<Reports/>} />
                <Route path="/customers" element={<Customers/>} />
                <Route path="/purchases" element={<Navigate to="/errands"/>}/>
                <Route path="/users" element={<Users/>} />
                <Route path="/settings" element={<Settings/>} />
            </Route>
        </Routes>
    )
}