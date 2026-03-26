import { useState } from "react";
import { navlinks } from "../data/navdata";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const activePath = "/formations";

  return (
    <nav className="sticky top-0 z-[100] w-full bg-navy px-6 lg:px-10 flex items-center justify-between h-[70px]">
      
      {/* Logo */}
      <div className="flex-shrink-0">
        <span className="text-white font-heading font-extrabold text-base tracking-wider uppercase italic cursor-pointer">
          ALT FORMATIONS
        </span>
      </div>

      {/* Menu Desktop */}
      <div className="hidden lg:flex items-center gap-6">
        {navlinks.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`text-[13px] font-semibold transition-colors duration-200 no-underline font-heading
              ${item.href === activePath 
                ? "text-orange" 
                : "text-gray-400 hover:text-white"
              }`}
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* Actions (Desktop) + Burger (Mobile) */}
      <div className="flex items-center gap-4">
        <button className="hidden sm:block btn-orange text-[13px] py-2 px-4">
          Se connecter
        </button>

        {/* Bouton Burger */}
        <button 
          className="lg:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      {/* Menu Mobile (Overlay) */}
      <div className={`
        fixed inset-0 bg-navy z-[-1] transition-transform duration-300 ease-in-out transform lg:hidden
        ${isOpen ? "translate-y-0" : "-translate-y-full"}
        pt-[70px] px-6
      `}>
        <div className="flex flex-col gap-6 py-10 border-t border-white/10">
          {navlinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`text-lg font-bold font-heading no-underline
                ${item.href === activePath ? "text-orange" : "text-white"}
              `}
            >
              {item.label}
            </a>
          ))}
          <button className="btn-orange w-full py-4 text-base mt-4">
            Se connecter
          </button>
        </div>
      </div>
    </nav>
  );
}