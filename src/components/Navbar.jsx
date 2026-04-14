import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navlinks } from "../data/navdata";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openMobileMenus, setOpenMobileMenus] = useState({});
  const location = useLocation();

  const toggleMobileMenu = (label) => {
    setOpenMobileMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <nav className="sticky top-0 z-[100] w-full bg-navy px-6 lg:px-10 flex items-center justify-between h-[70px]">

      {/* Logo - Taille réduite */}
      <Link to="/" className="flex-shrink-0 no-underline flex items-center gap-3 group">
        <img
          src="/Assets/logo-altrh.png"
          alt="Logo ALT Formations"
          // Hauteur réduite (h-8 sur mobile, h-10 sur desktop)
          className="h-8 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 [filter:drop-shadow(0_0_8px_rgba(255,255,255,0.8))]"
        />
        {/* Texte réduit (text-base md:text-lg) */}
        <span className="text-white font-heading font-extrabold text-base md:text-lg tracking-widest uppercase drop-shadow-md transition-colors duration-300 group-hover:text-orange">
          ALT RH & FORMATIONS
        </span>
      </Link>

      {/* Menu Desktop */}
      <div className="hidden lg:flex items-center gap-6">
        {navlinks.map((item) => (
          <div key={item.label} className="relative group py-[25px]">
            <Link
              to={item.href}
              // Lien principal Desktop agrandi : text-[15px]
              className={`text-[15px] font-semibold transition-colors duration-200 no-underline font-heading flex items-center gap-1
                ${location.pathname.startsWith(item.href) && item.href !== "/"
                  ? "text-orange"
                  : "text-gray-300 group-hover:text-white"
                }`}
            >
              {item.label}
              {item.submenu && (
                <svg className="w-3.5 h-3.5 fill-current opacity-50 group-hover:rotate-180 transition-transform" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              )}
            </Link>

            {/* Dropdown Desktop (Niveau 1) */}
            {item.submenu && (
              <div className="absolute top-[70px] left-0 w-[260px] bg-white shadow-xl rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
                <div className="flex flex-col py-2">
                  {item.submenu.map((sub) => (
                    <div key={sub.label} className="relative group/sub">
                      <Link
                        to={sub.href}
                        // Sous-menu niveau 1 agrandi : text-[14px]
                        className="px-5 py-3 text-[14px] font-bold text-navy hover:bg-orange hover:text-white transition-colors no-underline font-heading flex w-full items-center justify-between"
                      >
                        {sub.label}
                        {sub.submenu && (
                          <svg className="w-3.5 h-3.5 fill-current opacity-50" viewBox="0 0 20 20">
                            <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                          </svg>
                        )}
                      </Link>

                      {/* Dropdown Desktop (Niveau 2 et 3) */}
                      {sub.submenu && (
                        <div className="absolute top-0 left-full ml-0 w-[260px] bg-white shadow-xl rounded-lg opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-300 translate-x-[-10px] group-hover/sub:translate-x-0 z-[60]">
                          <div className="flex flex-col py-2">
                            {sub.submenu.map((subItem) => (
                              <div key={subItem.label} className="relative group/subItem">
                                <Link
                                  to={subItem.href}
                                  // Sous-menu niveau 2 agrandi : text-[14px]
                                  className="px-5 py-3 text-[14px] font-bold text-navy hover:bg-orange hover:text-white transition-colors no-underline font-heading flex items-center justify-between w-full"
                                >
                                  {subItem.label}
                                  {subItem.submenu && (
                                    <svg className="w-3.5 h-3.5 fill-current opacity-50" viewBox="0 0 20 20">
                                      <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                                    </svg>
                                  )}
                                </Link>

                                {/* Dropdown Desktop (Niveau 3) */}
                                {subItem.submenu && (
                                  <div className="absolute top-0 left-full ml-0 w-[260px] bg-white shadow-xl rounded-lg overflow-hidden opacity-0 invisible group-hover/subItem:opacity-100 group-hover/subItem:visible transition-all duration-300 translate-x-[-10px] group-hover/subItem:translate-x-0 z-50">
                                    <div className="flex flex-col py-2">
                                      {subItem.submenu.map((subSub) => (
                                        <Link
                                          key={subSub.label}
                                          to={subSub.href}
                                          // Sous-menu niveau 3 agrandi : text-[13px]
                                          className="px-5 py-3 text-[13px] font-bold text-navy hover:bg-orange hover:text-white transition-colors no-underline font-heading block w-full"
                                        >
                                          {subSub.label}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="hidden sm:block btn-orange text-[14px] py-2.5 px-5">
          <a href="/connexion">Se connecter</a>
        </button>

        <button className="lg:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16m-7 6h7" />}
          </svg>
        </button>
      </div>

      {/* Menu Mobile */}
      <div className={`fixed inset-0 bg-navy z-[90] transition-transform duration-300 lg:hidden ${isOpen ? "translate-y-0" : "-translate-y-full"} pt-[70px] px-6 overflow-y-auto`}>
        <div className="flex flex-col gap-6 py-10 border-t border-white/10">
          {navlinks.map((item) => (
            <div key={item.label} className="flex flex-col gap-4 text-left">
              <div className="flex items-center justify-between w-full">
                <Link
                  to={item.href}
                  onClick={() => !item.submenu && setIsOpen(false)}
                  // Lien Mobile Niveau 1 agrandi : text-xl
                  className={`text-xl font-bold font-heading no-underline flex-grow ${location.pathname.startsWith(item.href) && item.href !== "/" ? "text-orange" : "text-white"}`}
                >
                  {item.label}
                </Link>
                {item.submenu && (
                  <button onClick={() => toggleMobileMenu(item.label)} className="p-2 text-white">
                    <svg className={`w-6 h-6 fill-current transition-transform ${openMobileMenus[item.label] ? "rotate-180" : ""}`} viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Niveau 1 (Mobile) */}
              {item.submenu && openMobileMenus[item.label] && (
                <div className="flex flex-col gap-5 pl-4 border-l-2 border-orange/30">
                  {item.submenu.map((sub) => (
                    <div key={sub.label} className="flex flex-col gap-4">
                      <div className="flex items-center justify-between w-full">
                        <Link
                          to={sub.href}
                          onClick={() => !sub.submenu && setIsOpen(false)}
                          // Lien Mobile Niveau 2 agrandi : text-lg
                          className="text-gray-300 text-lg font-semibold no-underline flex-grow"
                        >
                          {sub.label}
                        </Link>
                        {sub.submenu && (
                          <button onClick={() => toggleMobileMenu(sub.label)} className="p-2 text-gray-400">
                            <svg className={`w-5 h-5 fill-current transition-transform ${openMobileMenus[sub.label] ? "rotate-180" : ""}`} viewBox="0 0 20 20">
                              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Niveau 2 (Mobile) */}
                      {sub.submenu && openMobileMenus[sub.label] && (
                        <div className="flex flex-col gap-4 pl-4 border-l-2 border-slate-600">
                          {sub.submenu.map((subItem) => (
                            <div key={subItem.label} className="flex flex-col gap-3">
                              <div className="flex items-center justify-between w-full">
                                <Link
                                  to={subItem.href}
                                  onClick={() => !subItem.submenu && setIsOpen(false)}
                                  // Lien Mobile Niveau 3 agrandi : text-base
                                  className="text-gray-400 text-base font-semibold no-underline flex-grow"
                                >
                                  {subItem.label}
                                </Link>
                                {subItem.submenu && (
                                  <button onClick={() => toggleMobileMenu(subItem.label)} className="p-1 text-gray-500">
                                    <svg className={`w-5 h-5 fill-current transition-transform ${openMobileMenus[subItem.label] ? "rotate-180" : ""}`} viewBox="0 0 20 20">
                                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                    </svg>
                                  </button>
                                )}
                              </div>

                              {/* Niveau 3 (Mobile) */}
                              {subItem.submenu && openMobileMenus[subItem.label] && (
                                <div className="flex flex-col gap-3 pl-4 border-l-2 border-gray-600/50">
                                  {subItem.submenu.map((subSub) => (
                                    <Link
                                      key={subSub.label}
                                      to={subSub.href}
                                      onClick={() => setIsOpen(false)}
                                      // Lien Mobile Niveau 4 agrandi : text-sm
                                      className="text-gray-500 text-sm font-semibold no-underline"
                                    >
                                      {subSub.label}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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