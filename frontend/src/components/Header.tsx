import { NavLink } from "react-router-dom";
import type { NavLinkRenderProps} from "react-router-dom";
import {useState} from "react";

export default function Header() {
    // Reusable styling for nav links
     const navLinkClass = ({isActive}: NavLinkRenderProps) => {
        return `flex items-center justify-center h-12 sm:h-full sm:px-2 md:px-4 lg:px-8 transition bg-[#001A31] sm:bg-[#001A31] my-4 rounded-xl sm:rounded-none 
         ${isActive ? "font-bold sm:bg-[#003666] text-[#0059FF] sm:text-[#F7F7F7]" : ""}`
     }
     const toggleModal = () => setModalOpen(!modalOpen);
     const [modalOpen, setModalOpen] = useState(false);
     
     return ( 
         <> 
             <header className={`${modalOpen ? "bg-[#E7F0EC] flex text-3xl items-center" : "hidden "} absolute top-6 bottom-22 right-10 left-10 sm:flex sm:static sm:bg-[#001A31] justify-center sm:w-full text-xl sm:text-[2vw] md:text-[1.5vw] lg:text-[1vw]`}> 
                 <nav className={`sm:flex justify-center items-center text-[#F7F7F7] font-poppins sm:h-16`}> 
                     <NavLink to={"/errands"} className={`px-4 hidden sm:flex`}> 
                         <img alt={"datile-logo"} src={"/DatileLogo.png"} height={50} width={100}/> 
                     </NavLink> <NavLink to={"/errands"} className={navLinkClass} onClick={toggleModal}>Ärenden</NavLink> 
                     <NavLink to={"/reports"} className={navLinkClass} onClick={toggleModal} >Rapporter</NavLink> 
                     <NavLink to={"/customers"} className={navLinkClass} onClick={toggleModal} >Kunder</NavLink> 
                     <NavLink to={"/purchases"} className={navLinkClass} onClick={toggleModal} >Inköp</NavLink> 
                     <NavLink to={"/users"} className={navLinkClass} onClick={toggleModal} >Användare</NavLink> 
                     <NavLink to={"/settings"} className={navLinkClass} onClick={toggleModal} >Inställningar</NavLink> 
                     <NavLink to={"/logout"} className={``} onClick={toggleModal}> 
                         <button className={`bg-[#99D0B6] px-8 mt-8 sm:mt-0 sm:py-1 rounded-full sm:ml-4 font-semibold font-poppins shadow hover:bg-[#6D9682] transition text-[#F7F7F7]`}>Logga ut</button> 
                     </NavLink> 
                 </nav> 
             </header> 
             <div className={`sm:hidden absolute bottom-0 right-0 bg-[#001A31] w-full h-15`}> 
                 <NavLink to={"/errands"} className={`absolute left-4 top-4`}> 
                     <img alt={"datile-logo"} src={"/datile-mobile-logo.png"} height={50} width={100}/> 
                 </NavLink> 
                 <img width={40} height={60} src="/hamburgerMenu.png" alt="mobile hamburger menu button" className={`absolute right-4 top-4 cursor-pointer`} onClick={toggleModal}/>
             </div>
         </>
     )
}