import { navlinks } from "../data/navdata";

export default function Navbar() {
  const activePath = "/formations";

  return (
    <nav className="sticky top-0 z-100 h-nav w-full bg-navy px-10 flex items-center justify-between">
      
      {/* Logo */}
      <div className="flex-shrink-0">
        <span className="text-white font-heading font-extrabold text-base tracking-wider uppercase italic cursor-pointer">
          ALT FORMATIONS
        </span>
      </div>

      {/* Liens de navigation */}
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

      {/* Bouton Connexion */}
      <button className="btn-orange text-[13px]">
        Se connecter
      </button>

    </nav>
  );
}