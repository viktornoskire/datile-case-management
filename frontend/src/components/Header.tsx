import { NavLink } from "react-router-dom";
import type { NavLinkRenderProps } from "react-router-dom";
import { useState, useEffect } from "react";
import {apiClient} from "../services/apiClient.ts";

export default function Header() {
    // Reusable styling for nav links
    const navLinkClass = ({isActive}: NavLinkRenderProps) => {
        return `flex items-center justify-center px-12 py-4 lg:px-8 md:px-4 sm:px-2 sm:h-full my-4 rounded-xl sm:rounded-none bg-[#001A31] sm:bg-[#001A31] shadow-md transition hover:scale-98 hover:bg-[#00213D] active:scale-95
        ${isActive ? "font-bold text-[#0059FF] sm:text-[#F7F7F7] sm:bg-[#003666] hover:bg-[#003666]" : ""}`;
    };

    const [modalOpen, setModalOpen] = useState(false);
    const [isMobileBarVisible, setIsMobileBarVisible] = useState(true);
    const toggleModal = () => setModalOpen(!modalOpen);

    useEffect(() => {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const handleScroll = () => {
            if (ticking) return;

            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                const scrollDifference = currentScrollY - lastScrollY;

                if (currentScrollY <= 10) {
                    setIsMobileBarVisible(true);
                } else if (scrollDifference > 5) {
                    setIsMobileBarVisible(false);
                } else if (scrollDifference < -5) {
                    setIsMobileBarVisible(true);
                }

                lastScrollY = currentScrollY;
                ticking = false;
            });

            ticking = true;
        };

        window.addEventListener("scroll", handleScroll, {passive: true});

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

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
                fixed top-6 right-10 bottom-22 left-10 z-50 sm:static sm:flex sm:w-full sm:bg-[#001A31]
                justify-center text-[5vw] sm:text-[2vw] md:text-[1.5vw] lg:text-[1vw] border sm:border-0 shadow-lg border-black/10 border-b-2`}
            >
                <nav className="font-poppins sm:flex sm:h-16 items-center justify-center text-[#F7F7F7]">
                    <NavLink to={"/errands"} className="hidden sm:flex px-4">
                        <img alt={"datile-logo"} src={"/DatileLogo.png"} height={50} width={100}/>
                    </NavLink>

                    <NavLink to={"/errands"} className={navLinkClass} onClick={toggleModal}>ÄRENDEN</NavLink>
                    <NavLink to={"/reports"} className={navLinkClass} onClick={toggleModal}>RAPPORTER</NavLink>
                    <NavLink to={"/customers"} className={navLinkClass} onClick={toggleModal}>KUNDER</NavLink>
                    <NavLink to={"/purchases"} className={navLinkClass} onClick={toggleModal}>INKÖP</NavLink>
                    <NavLink to={"/users"} className={navLinkClass} onClick={toggleModal}>ANVÄNDARE</NavLink>
                    <NavLink to={"/settings"} className={navLinkClass} onClick={toggleModal}>INSTÄLLNINGAR</NavLink>
                    <button
                        className="flex items-center justify-center py-1 mt-6 sm:mt-0 sm:ml-2 lg:px-8 md:px-4 sm:px-2 bg-[#99D0B6] rounded-xl sm:rounded-full drop-shadow-md transition hover:scale-98 hover:bg-[#88BFA5] active:scale-95 w-full sm:w-auto"
                        onClick={async () => {
                            toggleModal();
                            await apiClient.post("/api/auth/logout", {});
                            window.location.href = "/login";
                        }}
                    >
                        LOGGA UT
                    </button>
                </nav>
            </header>

            <div
                className={`fixed bottom-0 right-0 z-50 w-full h-16 bg-[#001A31] transition-transform duration-300 sm:hidden ${
                    isMobileBarVisible ? "translate-y-0" : "translate-y-full"
                }`}
            >
                <NavLink to={"/errands"} className="absolute left-4 top-4">
                    <img alt={"datile-logo"} src={"/datile-mobile-logo.png"} height={50} width={100}/>
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
