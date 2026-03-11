import { NavLink } from "react-router-dom";
import type { NavLinkRenderProps } from "react-router-dom";
import { useState } from "react";
import {apiClient} from "../services/apiClient.ts";

export default function Header() {
    // Reusable styling for nav links
    const navLinkClass = ({ isActive }: NavLinkRenderProps) => {
        return `flex items-center justify-center px-12 py-4 lg:px-8 md:px-4 sm:px-2 sm:h-full my-4 rounded-xl sm:rounded-none bg-[#001A31] sm:bg-[#001A31] shadow-md transition hover:scale-98 hover:bg-[#00213D] active:scale-95
        ${isActive ? "font-bold text-[#0059FF] sm:text-[#F7F7F7] sm:bg-[#003666] hover:bg-[#003666]" : ""}`;
    };

    const [modalOpen, setModalOpen] = useState(false);
    const toggleModal = () => setModalOpen(!modalOpen);

    return (
        <>
            {modalOpen && (
                <div
                    className="fixed inset-0 sm:hidden backdrop-blur-xs"
                    onClick={toggleModal}
                ></div>
            )}

            <header
                className={`${modalOpen ? "flex items-center bg-[#E7F0EC] rounded-xl sm:rounded-none" : "hidden"}
                fixed top-6 right-10 bottom-22 left-10 sm:static sm:flex sm:w-full sm:bg-[#001A31]
                justify-center text-[5vw] sm:text-[2vw] md:text-[1.5vw] lg:text-[1vw] border sm:border-0 shadow-lg border-black/10 border-b-2`}
            >
                <nav className="font-poppins sm:flex sm:h-16 items-center justify-center text-[#F7F7F7]">
                    <NavLink to={"/errands"} className="hidden sm:flex px-4">
                        <img alt={"datile-logo"} src={"/DatileLogo.png"} height={50} width={100} />
                    </NavLink>

                    <NavLink to={"/errands"} className={navLinkClass} onClick={toggleModal}>ÄRENDEN</NavLink>
                    <NavLink to={"/reports"} className={navLinkClass} onClick={toggleModal}>RAPPORTER</NavLink>
                    <NavLink to={"/customers"} className={navLinkClass} onClick={toggleModal}>KUNDER</NavLink>
                    <NavLink to={"/purchases"} className={navLinkClass} onClick={toggleModal}>INKÖP</NavLink>
                    <NavLink to={"/users"} className={navLinkClass} onClick={toggleModal}>ANVÄNDARE</NavLink>
                    <NavLink to={"/settings"} className={navLinkClass} onClick={toggleModal}>INSTÄLLNINGAR</NavLink>
                    <button className={`flex items-center justify-center py-1 mt-6 sm:mt-0 sm:ml-2 lg:px-8 md:px-4 sm:px-2 bg-[#99D0B6] rounded-xl sm:rounded-full drop-shadow-md transition hover:scale-98 hover:bg-[#88BFA5] active:scale-95`}>LOGGA UT</button>
                </nav>
            </header>

            <div className="fixed bottom-0 right-0 sm:hidden w-full h-15 bg-[#001A31]">
                <NavLink to={"/errands"} className="absolute left-4 top-4">
                    <img alt={"datile-logo"} src={"/datile-mobile-logo.png"} height={50} width={100} />
                </NavLink>

                <img
                    width={40}
                    height={60}
                    src="/hamburgerMenu.png"
                    alt="mobile hamburger menu button"
                    className="absolute right-4 top-4 cursor-pointer"
                    onClick={toggleModal}
                />
            </div>
        </>
    );
}