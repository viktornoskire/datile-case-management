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

    const [rememberMe, setRememberMe] = useState(false);
    const toggleRemember = () => {
        setRememberMe(!rememberMe);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        try {
            await apiClient.post("/api/auth/login", { username, password });

            // Ask backend who the user is (uses the cookie)
            await refreshAuth();

            // Go to main page
            navigate("/");
        } catch (err) {
            console.error("Login failed", err);
        }
    }

    return (
        <>
        <div className={`bg-[#F7F7F7] h-screen w-screen flex flex-col items-center`}>
            <img src="/DatileLogoBlack.png" alt="datile-logo" width={250} height={200} className="mx-auto mt-16"/>
            <form onSubmit={handleSubmit} className={`flex flex-col gap-4 bg-[#FFFFFF] border border-[#D9D9D9] mt-6 p-8 sm:w-[50vw] md:w-[40vw] lg:w-[30vw] rounded-xl sm:rounded-3xl shadow-md`}>
                <label className={`font-poppins font-bold -mb-2`}>E-postadress</label>
                <input name="username" placeholder="mail@gmail.com" required className={`border border-[#D9D9D9] rounded-md p-2 outline-0`}/>
                <label className={`font-bold font-poppins -mb-2 mt-4`}>Lösenord</label>
                <input name="password" type="password" required className={`border border-[#D9D9D9] font-semibold rounded-md p-2 outline-none`} />
                <button type="submit" className={`bg-[#001A31] text-[#F7F7F7] font-semibold font-poppins rounded-md text-sm py-2`}>Logga in</button>
                <p className={`underline text-sm cursor-pointer`} onClick={toggleRemember}>Har du glömt lösenordet?</p>
                <h1 className={`text-3xl ${rememberMe ? "block" : "hidden"}`}>Synd!</h1>
            </form>
        </div>
        </>
    );
}