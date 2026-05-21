import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navlinks, megaMenuFormations, megaMenuCombinedDiplCertRows } from "../data/navdata";
// import { useAuth } from "../context/AuthContext";

function navFormationsCatalogActive(location) {
  if (location.pathname !== "/formations") return { combined: false, navActive: false };
  const t = new URLSearchParams(location.search).get("type");
  const elearning = t === "elearning" || t === "courtes" || t === "courte";
  return { combined: !elearning, elearning, navActive: true };
}

function catalogScopeFromLocation(pathname, search) {
  if (pathname !== "/formations") return "combined";
  const t = new URLSearchParams(search).get("type");
  const elearning = t === "elearning" || t === "courtes" || t === "courte";
  return elearning ? "elearning" : "combined";
}

function buildCombinedMegaRows() {
  return megaMenuCombinedDiplCertRows.map((row) => ({
    ...row,
    rowKey:
      row.kind === "merged" ? `m:${row.id}` : row.kind === "diplomantes" ? `d:${row.id}` : `c:${row.id}`,
  }));
}

function firstCombinedRowKey() {
  const r = megaMenuCombinedDiplCertRows[0];
  if (!r) return null;
  return r.kind === "merged" ? `m:${r.id}` : r.kind === "diplomantes" ? `d:${r.id}` : `c:${r.id}`;
}

function buildElearningMegaRows() {
  return megaMenuFormations.elearning.map((c) => ({ ...c, rowKey: `e:${c.id}`, kind: "elearning" }));
}

// ── Mega Menu Formations ───────────────────────────────────────────────────────
function FormationsMegaMenu({ onMouseEnter, onMouseLeave, onClose }) {
  const location = useLocation();
  const [catalogScope, setCatalogScope] = useState(() =>
    catalogScopeFromLocation(location.pathname, location.search)
  );
  const variant = catalogScope === "combined" ? "combined" : "elearning";

  const [hoveredRowKey, setHoveredRowKey] = useState(() =>
    variant === "elearning"
      ? megaMenuFormations.elearning[0]
        ? `e:${megaMenuFormations.elearning[0].id}`
        : null
      : firstCombinedRowKey()
  );

  useEffect(() => {
    setCatalogScope(catalogScopeFromLocation(location.pathname, location.search));
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (catalogScope === "elearning") {
      const first = megaMenuFormations.elearning[0];
      setHoveredRowKey(first ? `e:${first.id}` : null);
    } else {
      setHoveredRowKey(firstCombinedRowKey());
    }
  }, [catalogScope]);

  const megaRows = variant === "elearning" ? buildElearningMegaRows() : buildCombinedMegaRows();
  const currentRow = megaRows.find((r) => r.rowKey === hoveredRowKey) || megaRows[0];

  const handleCatalogScopeChange = (scope) => {
    setCatalogScope(scope);
  };

  const ctaTo =
    variant === "elearning" ? "/formations?type=elearning" : "/formations";

  const ctaLabel =
    variant === "elearning"
      ? "Tout le catalogue E-Learning"
      : "Tout le catalogue diplômantes & certifiantes";

  return (
    <div
      className="absolute top-full left-0 right-0 bg-white shadow-2xl border-t-[3px] border-accent z-[99] overflow-hidden"
      style={{ maxHeight: "520px" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex" style={{ height: "520px" }}>

        {/* ── LEFT SIDEBAR ── */}
        <div className="w-72 bg-[#f8f9fb] border-r border-gray-100 flex flex-col shrink-0">

          {/* Diplômantes & certifiantes | E-Learning */}
          <div className="p-4 border-b border-gray-100 shrink-0">
            <div className="flex gap-1 bg-gray-200/80 rounded-xl p-1">
              <button
                type="button"
                onClick={() => handleCatalogScopeChange("combined")}
                className={`flex-1 text-[10px] font-bold py-2 rounded-lg transition-all leading-tight ${catalogScope === "combined"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Diplômantes & certifiantes
              </button>
              <button
                type="button"
                onClick={() => handleCatalogScopeChange("elearning")}
                className={`flex-1 text-[11px] font-bold py-2 rounded-lg transition-all ${catalogScope === "elearning"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                E-Learning
              </button>
            </div>
          </div>

          {/* Liste des catégories (diplômantes + certifiantes fusionnées, ou e-learning) */}
          <div className="flex-1 overflow-y-auto py-2">
            {megaRows.map((row) => (
              <button
                key={row.rowKey}
                type="button"
                onMouseEnter={() => setHoveredRowKey(row.rowKey)}
                onClick={() => setHoveredRowKey(row.rowKey)}
                className={`w-full flex items-center px-5 py-3 text-left text-sm font-bold transition-all border-l-[3px] ${hoveredRowKey === row.rowKey
                  ? "border-accent bg-accent/5 text-accent"
                  : "border-transparent text-primary hover:bg-gray-100 hover:text-accent"
                  }`}
              >
                <span className="truncate">{row.label}</span>
              </button>
            ))}
          </div>

          {/* CTA bas */}
          <div className="p-4 border-t border-gray-100 shrink-0">
            <Link
              to={ctaTo}
              onClick={onClose}
              className="flex items-center justify-between w-full px-4 py-3 bg-primary text-white rounded-xl text-xs font-bold no-underline hover:bg-primary/90 transition-colors"
            >
              <span>{ctaLabel}</span>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── RIGHT: détail catégorie ── */}
        {currentRow && (
          <div className="flex-1 flex flex-col overflow-hidden">

            {/* Header catégorie avec image */}
            <div className="flex items-center gap-5 px-8 py-5 border-b border-gray-100 bg-white shrink-0">
              <div className="relative w-32 h-[72px] rounded-xl overflow-hidden shadow-md shrink-0">
                <img
                  src={currentRow.image}
                  alt={currentRow.label}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-extrabold text-accent uppercase tracking-widest mb-0.5">
                  {currentRow.kind === "merged"
                    ? "Diplômantes & certifiantes"
                    : currentRow.kind === "diplomantes"
                      ? "Formation diplômante"
                      : currentRow.kind === "certifiantes"
                        ? "Formation certifiante"
                        : "E-Learning"}
                </p>
                <h3 className="font-heading font-extrabold text-primary text-lg uppercase tracking-wide truncate">
                  {currentRow.label}
                </h3>
                <Link
                  to={currentRow.href}
                  onClick={onClose}
                  className="text-[11px] text-accent font-semibold hover:underline no-underline"
                >
                  Voir toutes les formations de ce domaine →
                </Link>
              </div>
            </div>

            {/* Grille formations avec images + badge vidéo */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                {currentRow.formations.map((f, i) => (
                  <Link
                    key={i}
                    to={f.href}
                    onClick={onClose}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 hover:border-accent/40 hover:bg-orange-50/50 transition-all no-underline group"
                  >
                    <div className="relative w-14 h-11 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={f.image}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-primary group-hover:text-accent transition-colors line-clamp-2 leading-snug flex-1">
                      {f.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GenericMegaMenu({ item, onMouseEnter, onMouseLeave }) {
  if (!item?.submenu?.length) return null;

  return (
    <div
      className="absolute top-full left-0 right-0 bg-white shadow-2xl border-t-[3px] border-accent z-[99]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="max-w-container-3xl mx-auto px-8 py-6">
        <p className="text-[10px] font-extrabold text-accent uppercase tracking-widest mb-4">
          {item.label}
        </p>

        <div className={`grid gap-4 ${item.submenu.length > 2 ? "grid-cols-3" : "grid-cols-2"}`}>
          {item.submenu.map((sub) => (
            <Link
              key={sub.label}
              to={sub.href || "#"}
              className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-accent/40 hover:bg-orange-50/50 transition-all no-underline group"
            >
              {sub.image && (
                <div className="w-16 h-14 shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={sub.image}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-primary group-hover:text-accent transition-colors truncate">
                  {sub.label}
                </p>
                {sub.description && (
                  <p className="text-xs text-content-muted mt-0.5 line-clamp-2 leading-snug">
                    {sub.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Navbar principale ──────────────────────────────────────────────────────────
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openMobileMenus, setOpenMobileMenus] = useState({});
  const [activeMegaLabel, setActiveMegaLabel] = useState(null);
  const closeTimer = useRef(null);
  const location = useLocation();
  const formationsNav = navFormationsCatalogActive(location);
  // const navigate = useNavigate();
  // const { user, isAdmin, logout } = useAuth();

  // const handleLogout = async () => {
  //   await logout();
  //   setIsOpen(false);
  //   navigate("/accueil");
  // };

  const toggleMobileMenu = (label) => {
    setOpenMobileMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const openMega = (label) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMegaLabel(label);
  };

  const scheduleMegaClose = () => {
    closeTimer.current = setTimeout(() => setActiveMegaLabel(null), 180);
  };

  return (
    <nav className="sticky top-0 z-[100] w-full bg-primary relative">
      {/* Padding gauche/droite : px-4 xl:px-8 */}
      <div className="relative w-full px-4 xl:px-8 flex items-center justify-between h-[80px] gap-6 xl:gap-8">

        {/* Logo */}
        <Link
          to="/"
          className={`relative z-[101] flex-shrink-0 no-underline group flex items-center transition-opacity duration-200 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <img
            src="/assets/logo-altrh.png"
            alt="Logo Alt Formations"
            className="h-14 md:h-16 w-auto max-h-16 object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] drop-shadow-[0_0_18px_rgba(255,255,255,0.45)]"
          />
        </Link>
        
        {/* Liens centrés — léger décalage vers la gauche pour rapprocher du logo */}
        <div className="pointer-events-none absolute inset-0 hidden xl:flex items-center justify-center z-[100]">
          <div className="pointer-events-auto flex items-center gap-2 2xl:gap-6 -translate-x-14 2xl:-translate-x-20">
            {navlinks.map((item) => {
              if (item.submenu) {
                return (
                  <div
                    key={item.label}
                    className="self-stretch flex items-center"
                    onMouseEnter={() => openMega(item.label)}
                    onMouseLeave={scheduleMegaClose}
                  >
                    {item.href ? (
                      <Link
                        to={item.href}
                        className={`text-nav 2xl:text-nav-lg font-semibold transition-colors duration-200 no-underline font-heading flex items-center gap-1 ${
                          item.label === "Formations"
                            ? formationsNav.navActive
                              ? "text-accent"
                              : "text-gray-300 hover:text-white"
                            : item.href !== "/" && location.pathname.startsWith(item.href)
                              ? "text-accent"
                              : "text-gray-300 hover:text-white"
                        }`}
                      >
                        {item.label}
                        <svg
                          className={`w-3.5 h-3.5 fill-current opacity-50 transition-transform duration-200 ${activeMegaLabel === item.label ? "rotate-180" : ""
                            }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className={`text-nav 2xl:text-nav-lg font-semibold transition-colors duration-200 font-heading flex items-center gap-1 bg-transparent border-0 cursor-pointer p-0 ${activeMegaLabel === item.label
                          ? "text-accent"
                          : "text-gray-300 hover:text-white"
                          }`}
                      >
                        {item.label}
                        <svg
                          className={`w-3.5 h-3.5 fill-current opacity-50 transition-transform duration-200 ${activeMegaLabel === item.label ? "rotate-180" : ""
                            }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              }

              return (
                <div key={item.label} className="py-[25px]">
                  <Link
                    to={item.href}
                    className={`text-nav 2xl:text-nav-lg font-semibold transition-colors duration-200 no-underline font-heading flex items-center gap-1 ${item.href !== "/" && location.pathname.startsWith(item.href)
                      ? "text-accent"
                      : "text-gray-300 hover:text-white"
                      }`}
                  >
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions + burger */}
        <div className="relative z-[101] flex items-center gap-3 shrink-0">
          {/* Auth desktop commenté
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="text-xs sm:text-sm font-bold text-primary bg-accent hover:bg-accent-dark hover:text-white px-3 py-2 rounded-lg no-underline transition-colors"
                  >
                    Admin · {user.prenom}
                  </Link>
                ) : (
                  <Link
                    to="/mon-espace"
                    className="text-xs sm:text-sm font-bold text-primary bg-white hover:bg-gray-100 px-3 py-2 rounded-lg no-underline transition-colors"
                  >
                    {user.prenom}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-xs sm:text-sm font-bold text-white hover:text-accent px-2 py-2 transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link to="/connexion" className="hidden sm:block btn-orange text-sm py-2.5 px-5 no-underline">
                Se connecter
              </Link>
            )}
            */}

          {!isOpen && (
            <button className="xl:hidden text-white p-2" onClick={() => setIsOpen(true)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {activeMegaLabel === "Formations" && (
        <FormationsMegaMenu
          onMouseEnter={() => openMega("Formations")}
          onMouseLeave={scheduleMegaClose}
          onClose={() => setActiveMegaLabel(null)}
        />
      )}
      {activeMegaLabel && activeMegaLabel !== "Formations" && (
        <GenericMegaMenu
          item={navlinks.find((n) => n.label === activeMegaLabel)}
          onMouseEnter={() => openMega(activeMegaLabel)}
          onMouseLeave={scheduleMegaClose}
        />
      )}

      {/* ── Menu Mobile ── */}
      <div
        className={`fixed inset-0 bg-primary z-[90] transition-transform duration-300 xl:hidden ${isOpen ? "translate-y-0" : "-translate-y-full"
          } flex flex-col overflow-y-auto`}
      >
          <div className="flex items-center justify-end px-6 min-h-[70px] border-b border-white/10 shrink-0">
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-gray-300 hover:text-white bg-white/5 px-3 py-2 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-semibold uppercase">Retour</span>
            </button>
          </div>

          <div className="flex flex-col gap-6 py-10 px-6">
            {navlinks.map((item) => (
              <div key={item.label} className="flex flex-col gap-4 text-left">
                <div className="flex items-center justify-between w-full">
                  {item.href ? (
                    <Link
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-xl font-bold font-heading no-underline flex-grow ${
                        item.label === "Formations"
                          ? formationsNav.navActive
                            ? "text-accent"
                            : "text-white"
                          : location.pathname.startsWith(item.href) && item.href !== "/"
                            ? "text-accent"
                            : "text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-xl font-bold font-heading flex-grow text-white">
                      {item.label}
                    </span>
                  )}
                  {item.submenu && (
                    <button onClick={() => toggleMobileMenu(item.label)} className="p-2 text-white">
                      <svg
                        className={`w-6 h-6 fill-current transition-transform ${openMobileMenus[item.label] ? "rotate-180" : ""
                          }`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Mobile sous-menu */}
                {item.submenu && openMobileMenus[item.label] && (
                  <div className="flex flex-col gap-5 pl-4 border-l-2 border-accent/30">
                    {item.submenu.map((sub) => (
                      <div key={sub.label} className="flex flex-col gap-4">
                        <div className="flex items-center justify-between w-full">
                          <Link
                            to={sub.href}
                            onClick={() => setIsOpen(false)}
                            className="text-gray-300 text-lg font-semibold no-underline flex-grow"
                          >
                            {sub.label}
                          </Link>
                          {sub.submenu && (
                            <button onClick={() => toggleMobileMenu(sub.label)} className="p-2 text-gray-400">
                              <svg
                                className={`w-5 h-5 fill-current transition-transform ${openMobileMenus[sub.label] ? "rotate-180" : ""
                                  }`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                              </svg>
                            </button>
                          )}
                        </div>

                        {sub.submenu && openMobileMenus[sub.label] && (
                          <div className="flex flex-col gap-4 pl-4 border-l-2 border-slate-600">
                            {sub.submenu.map((subItem) => (
                              <div key={subItem.label} className="flex flex-col gap-3">
                                <div className="flex items-center justify-between w-full">
                                  <Link
                                    to={subItem.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 text-base font-semibold no-underline flex-grow"
                                  >
                                    {subItem.label}
                                  </Link>
                                  {subItem.submenu && (
                                    <button onClick={() => toggleMobileMenu(subItem.label)} className="p-1 text-gray-500">
                                      <svg
                                        className={`w-5 h-5 fill-current transition-transform ${openMobileMenus[subItem.label] ? "rotate-180" : ""
                                          }`}
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                      </svg>
                                    </button>
                                  )}
                                </div>

                                {subItem.submenu && openMobileMenus[subItem.label] && (
                                  <div className="flex flex-col gap-3 pl-4 border-l-2 border-gray-600/50">
                                    {subItem.submenu.map((subSub) => (
                                      <Link
                                        key={subSub.label}
                                        to={subSub.href}
                                        onClick={() => setIsOpen(false)}
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

            {/* Auth mobile commenté
            <div className="mt-4 pt-6 border-t border-white/10 flex flex-col gap-3">
              {user ? (
                <>
                  {isAdmin ? (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="bg-accent text-white text-center py-3 px-5 rounded-lg font-bold no-underline"
                    >
                      Tableau de bord admin ({user.prenom})
                    </Link>
                  ) : (
                    <Link
                      to="/mon-espace"
                      onClick={() => setIsOpen(false)}
                      className="bg-white text-primary text-center py-3 px-5 rounded-lg font-bold no-underline"
                    >
                      Mon espace ({user.prenom})
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="border border-white/30 text-white text-center py-3 px-5 rounded-lg font-bold"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/connexion"
                    onClick={() => setIsOpen(false)}
                    className="btn-orange text-center py-3 px-5 no-underline"
                  >
                    Se connecter
                  </Link>
                  <Link
                    to="/inscription"
                    onClick={() => setIsOpen(false)}
                    className="border border-white/30 text-white text-center py-3 px-5 rounded-lg font-bold no-underline"
                  >
                    Créer un compte
                  </Link>
                </>
              )}
            </div>
            */}
          </div>
        </div>
    </nav>
  );
}