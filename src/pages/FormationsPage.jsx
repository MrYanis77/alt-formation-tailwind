import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero/Hero';
import CardFormation from '../components/Card/CardFormation';
import CallToAction from '../components/CallToAction';
import { hero, catalogue } from '../data/formations';

// ── Icônes SVG (Formatées comme dans GestionCarriere) ──────────────────────────
const IconNumerique = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
  </svg>
);

const IconRH = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);

// ── Regroupement des catégories ────────────────────────────────────────────────
const themes = [
  {
    id: 'numerique',
    label: 'Numérique',
    icon: <IconNumerique />,
    description: "Cybersécurité, développement web & mobile, IA — des parcours certifiants pour les métiers du numérique qui recrutent massivement.",
    categoryIds: ['cybersecurite-reseaux', 'digital-developpement'],
  },
  {
    id: 'gestion-rh',
    label: 'Gestion / RH',
    icon: <IconRH />,
    description: "Ressources humaines, comptabilité, gestion administrative — des formations reconnues par l'État pour des carrières stables et évolutives.",
    categoryIds: ['rh-tertiaire', 'comptabilite-gestion'],
  },
];

const themesWithData = themes.map((theme) => ({
  ...theme,
  categories: theme.categoryIds
    .map((catId) => catalogue.find((c) => c.id === catId))
    .filter(Boolean),
}));

export default function FormationsPage() {
  const [activeTheme, setActiveTheme] = useState(null);
  const location = useLocation();

  // Scroll vers l'ancre si présente dans l'URL
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setActiveTheme(id);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }, [location.hash]);

  const getThemeCount = (theme) =>
    theme.categories.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <div className="bg-surface min-h-screen antialiased">

      {/* --- HERO --- */}
      <Hero
        title={hero.titre}
        subtitle={hero.sousTitre}
        video={hero.video}
      />

      {/* --- BREADCRUMB --- */}
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Formations' }]} />

      {/* ===== SÉLECTEUR DE THÈMES ===== */}
      <section className="pt-16 pb-20 bg-surface-soft border-b border-border">
        <div className="max-w-container-xl mx-auto px-6">

          {/* En-tête inspiré de GestionCarriere */}
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary uppercase tracking-wide">
              Explorez nos domaines d'expertise
            </h2>
            <div className="w-20 h-1.5 bg-accent mx-auto mt-6 rounded-full mb-8"></div>
            <p className="text-[17px] text-content-muted leading-relaxed font-body max-w-3xl mx-auto">
              Découvrez nos parcours certifiants pensés pour répondre aux besoins concrets des entreprises d'aujourd'hui.
            </p>
          </div>

          {/* Grille de sélection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {themesWithData.map((theme) => {
              const isActive = activeTheme === theme.id;
              const count = getThemeCount(theme);
              return (
                <a
                  key={theme.id}
                  href={`#${theme.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTheme(isActive ? null : theme.id);
                    setTimeout(() => {
                      const el = document.getElementById(theme.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }}
                  className={`group flex flex-col items-start p-8 rounded-2xl transition-all duration-300 no-underline cursor-pointer border text-left
                    ${isActive
                      ? 'bg-white border-accent shadow-md ring-1 ring-accent'
                      : 'bg-white border-gray-200 hover:border-accent hover:shadow-lg'
                    }`}
                >
                  <div className="flex justify-between items-center w-full mb-6">
                    {/* Conteneur d'icône type GestionCarriere */}
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110
                      ${isActive ? 'bg-accent text-white' : 'bg-surface-soft text-accent shadow-sm'}
                    `}>
                      {theme.icon}
                    </div>
                    <span className={`text-sm font-semibold px-4 py-1.5 rounded-full transition-colors
                      ${isActive ? 'bg-accent/10 text-accent' : 'bg-surface-soft border border-gray-200 text-content-muted'}
                    `}>
                      {count} formations
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                    {theme.label}
                  </h3>
                  <p className="text-[15px] text-content-muted leading-relaxed font-body">
                    {theme.description}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CONTENU DES THÈMES ===== */}
      {themesWithData.map((theme) => {
        const isVisible = activeTheme === theme.id || activeTheme === null;
        if (!isVisible) return null;

        return (
          <section key={theme.id} id={theme.id} className="scroll-mt-[90px] pt-20">

            {/* Header de section du thème */}
            <div className="px-6 mb-8 text-center">
              <div className="max-w-container-xl mx-auto flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6">
                  {theme.icon}
                </div>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary uppercase tracking-wide">
                  Formations en {theme.label}
                </h2>
                <div className="w-20 h-1.5 bg-gray-200 mx-auto mt-6 rounded-full mb-2"></div>
              </div>
            </div>

            {/* Catégories du thème */}
            {theme.categories.map((category, cIdx) => {
              const isDark = cIdx % 2 !== 0;
              return (
                <div key={category.id} id={category.id} className={`py-16 px-6 ${isDark ? 'bg-surface-soft border-t border-b border-gray-100' : 'bg-white'}`}>
                  <div className="max-w-container-xl mx-auto">

                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 border-b border-gray-200 pb-4">
                      <div>
                        <h3 className="font-heading text-2xl font-bold text-primary">
                          {category.label}
                        </h3>
                      </div>
                      <div className="text-[15px] text-content-muted font-semibold font-body">
                        {category.items.length} programme{category.items.length > 1 ? 's' : ''}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {category.items.map((item, idx) => (
                        <CardFormation
                          key={idx}
                          title={item.titre}
                          image={item.imageUrl || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800"}
                          points={item.features}
                          variant={isDark ? "white" : "navy"}
                          href={item.href}
                        />
                      ))}
                    </div>

                  </div>
                </div>
              );
            })}
          </section>
        );
      })}

      {/* --- CTA FINAL --- */}
      <CallToAction
        variante="sombre"
        title="Besoin d'un conseil personnalisé ?"
        subtitle="Nos conseillers sont à votre écoute pour vous orienter vers la formation la plus adaptée à votre profil et vos financements."
        buttonText="PRENDRE RENDEZ-VOUS"
        onButtonClick={() => window.location.href = 'tel:0123456789'}
      />

    </div>
  );
}