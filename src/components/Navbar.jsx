import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navlinks } from "../data/navdata";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-[100] w-full bg-navy px-6 lg:px-10 flex items-center justify-between h-[70px]">
      
      {/* Logo */}
      <Link to="/" className="flex-shrink-0 no-underline flex items-center gap-3">
        <img 
          src="../public/Assets/logo-altrh.png" 
          alt="Logo ALT Formations" 
          className="h-8 w-auto object-contain" 
        />
        <span className="text-white font-heading font-extrabold text-base tracking-wider uppercase cursor-pointer">
          ALT FORMATIONS
        </span>
      </Link>

      {/* Menu Desktop */}
      <div className="hidden lg:flex items-center gap-6">
        {navlinks.map((item) => (
          <div key={item.label} className="relative group py-[25px]">
            <Link
              to={item.href}
              className={`text-[13px] font-semibold transition-colors duration-200 no-underline font-heading flex items-center gap-1
                ${location.pathname.startsWith(item.href) 
                  ? "text-orange" 
                  : "text-gray-400 group-hover:text-white"
                }`}
            >
              {item.label}
              {item.submenu && (
                <svg className="w-3 h-3 fill-current opacity-50 group-hover:rotate-180 transition-transform" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              )}
            </Link>

            {/* Dropdown Desktop */}
            {item.submenu && (
              <div className="absolute top-[70px] left-0 w-[240px] bg-white shadow-xl rounded-b-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <div className="flex flex-col py-2">
                  {item.submenu.map((sub) => (
                    <Link
                      key={sub.label}
                      to={sub.href}
                      className="px-5 py-3 text-[13px] font-bold text-navy hover:bg-orange hover:text-white transition-colors no-underline font-heading"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="hidden sm:block btn-orange text-[13px] py-2 px-4">
          <a href="/connexion">Se connecter</a>
        </button>

        <button className="lg:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16m-7 6h7" />}
          </svg>
        </button>
      </div>

      {/* Menu Mobile */}
      <div className={`fixed inset-0 bg-navy z-[-1] transition-transform duration-300 lg:hidden ${isOpen ? "translate-y-0" : "-translate-y-full"} pt-[70px] px-6 overflow-y-auto`}>
        <div className="flex flex-col gap-6 py-10 border-t border-white/10">
          {navlinks.map((item) => (
            <div key={item.label} className="flex flex-col gap-4 text-left">
              <Link
                to={item.href}
                onClick={() => !item.submenu && setIsOpen(false)}
                className={`text-lg font-bold font-heading no-underline ${location.pathname.startsWith(item.href) ? "text-orange" : "text-white"}`}
              >
                {item.label}
              </Link>
              {item.submenu && (
                <div className="flex flex-col gap-4 pl-4 border-l-2 border-orange/30">
                  {item.submenu.map((sub) => (
                    <Link key={sub.label} to={sub.href} onClick={() => setIsOpen(false)} className="text-gray-400 text-base font-semibold no-underline">
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}