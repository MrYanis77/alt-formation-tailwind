import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero/Hero';
import Breadcrumb from '../components/Breadcrumb';
import CardFormation from '../components/Card/CardFormation';
import CardGrid from '../components/Card/CardGrid';
import StatsSection from '../components/Stats/StatsSection';
import CallToAction from '../components/CallToAction';
import FiltreCat from '../components/Items/FiltreCat';
import { catalogueCourtes } from '../data/formations';
import { hero, features, stats } from '../data/elearning';
import { Shield, Code, Users, Container, Monitor, Cpu, Filter } from 'lucide-react';

const categoryIcons = {
  'cybersecurite': <Shield className="w-6 h-6" />,
  'digital-developpement': <Code className="w-6 h-6" />,
  'management': <Users className="w-6 h-6" />,
  'devops-devsecops': <Container className="w-6 h-6" />,
  'informatique-systemes-reseaux': <Monitor className="w-6 h-6" />,
  'systemes-embarques-iot': <Cpu className="w-6 h-6" />,
};

export default function ElearningPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredCatalogue = useMemo(() => {
    return catalogueCourtes
      .map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
          item.titre.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter(cat => cat.items.length > 0);
  }, [searchTerm]);

  const visibleCatalogue = useMemo(() => {
    if (activeCategory === 'all') return filteredCatalogue;
    return filteredCatalogue.filter(c => c.id === activeCategory);
  }, [filteredCatalogue, activeCategory]);

  return (
    <div className="bg-surface min-h-screen antialiased">

      {/* HERO */}
      <Hero
        title={hero.titre}
        subtitle={hero.sousTitre}
        video={hero.video}
      />

      <Breadcrumb
        items={[
          { label: 'Accueil', to: '/' },
          { label: 'E-Learning' },
        ]}
      />
  

      {/* FILTRE & RECHERCHE */}
      <FiltreCat
        categories={catalogueCourtes.map(cat => ({
          id: cat.id,
          label: cat.label,
          icon: categoryIcons[cat.id] || <Filter className="w-3.5 h-3.5" />,
        }))}
        activeCat={activeCategory}
        setActiveCat={setActiveCategory}
        allValue="all"
        allLabel="Tous les domaines"
        sectionLabel="Domaines"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchPlaceholder="Rechercher une formation…"
      />

      {/* CATALOGUE */}
      <div className="space-y-4 py-12">
        {visibleCatalogue.length > 0 ? (
          visibleCatalogue.map(cat => (
            <section key={cat.id} id={cat.id} className="scroll-mt-[180px]">
              <div className="max-w-container-3xl mx-auto px-6 mb-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                    {categoryIcons[cat.id] || <Filter className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-primary uppercase tracking-wide">
                      {cat.label}
                    </h2>
                    <p className="text-content-muted text-sm font-body">{cat.description}</p>
                  </div>
                </div>
                <div className="w-full h-px bg-gray-100" />
              </div>

              <div className="mb-20 px-6">
                <div className="max-w-container-3xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cat.items.map((item, idx) => (
                      <CardFormation
                        key={idx}
                        title={item.titre}
                        image={item.imageUrl || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800'}
                        points={item.features}
                        variant="white"
                        href={item.href}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Aucune formation trouvée</h3>
            <p className="text-content-muted">Essayez d'ajuster vos critères de recherche.</p>
            <button
              onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
              className="mt-6 text-accent font-bold hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* LIEN VERS FORMATIONS LONGUES */}
      <section className="py-12 px-6 bg-gray-50 border-y border-border">
        <div className="max-w-container-xl mx-auto text-center">
          <p className="text-content-muted text-sm mb-3 font-body">
            Vous cherchez une formation diplômante longue durée ?
          </p>
          <Link
            to="/formations"
            className="inline-flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors text-sm"
          >
            Voir toutes nos formations diplômantes →
          </Link>
        </div>
      </section>

      <CallToAction
        variante="sombre"
        titre="Une formation sur mesure ?"
        sousTitre="Nos conseillers peuvent adapter le contenu et le planning de toute formation courte à votre équipe ou vos besoins spécifiques."
        texteBouton="NOUS CONTACTER"
        lienBouton="/contact"
      />
    </div>
  );
}
