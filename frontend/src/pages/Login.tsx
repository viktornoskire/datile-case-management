import { apiClient } from "../services/apiClient";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {useState} from "react";

export default function Login() {
    const { user } = useAuth();

    React.useEffect(() => {
        if (user) navigate("/");
    }, [user]);

    const navigate = useNavigate();
    const { refreshAuth } = useAuth();

    const [error, setError] = useState<boolean>(false);
    const toggleError = () => {
        setError(!error);
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            await apiClient.post("/api/auth/login", {
                email: email.toLowerCase().replace(/\s+/g, ""),
                password: password });

            // Ask backend who the user is (uses the cookie)
            await refreshAuth();

            // Go to main page
            navigate("/");
        } catch (err) {
            console.error("Login failed:", err);
            toggleError();
        }
    }

    return (
        <>
        <div className={`bg-[#F7F7F7] h-screen w-screen flex flex-col items-center`}>
            <img src="/DatileLogoBlack.png" alt="datile-logo" width={250} height={200} className="mx-auto mt-16"/>
            <form onSubmit={handleSubmit} onChange={() => {
                if (error) toggleError();
            }}  className={`flex flex-col gap-4 bg-[#FFFFFF] border border-[#D9D9D9] mt-6 p-8 sm:w-[50vw] md:w-[40vw] lg:w-[30vw] rounded-xl sm:rounded-3xl shadow-md`}>
                <p className={`text-red-600 font-bold font-poppins text-xs transition ${error ? "" : "hidden"}`}>Fel e-postadress eller lösenord</p>
                <label className={`font-poppins font-bold -mb-2`}>E-postadress</label>
                <input name="email"
                       placeholder="mail@gmail.com" type={`email`}
                       required
                       className={`border border-[#D9D9D9] rounded-md p-2 outline-0`}
                       onChange={(e) => setEmail(e.target.value)}
                />
                <label className={`font-bold font-poppins -mb-2 mt-4`}>Lösenord</label>
                <input name="password"
                       type="password"
                       required
                       className={`border border-[#D9D9D9] font-semibold rounded-md p-2 outline-none`}
                        onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit" className={`bg-[#001A31] text-[#F7F7F7] font-semibold font-poppins rounded-md text-sm py-2 hover:bg-[#001A3F] hover:scale-99 transition active:scale-95`}>Logga in</button>
            </form>
        </div>
        </>
    );
}