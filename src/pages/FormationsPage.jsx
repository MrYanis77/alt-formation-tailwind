import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import CardFormation from '../components/CardFormation'; // Import du nouveau composant
import { catalogue } from '../data/formations';

export default function FormationsPage() {
  return (
    <div className="bg-white min-h-screen">
      
      {/* Fil d'ariane */}
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Formations' }]} />
      
      {/* Hero Section */}
      <Hero
        title="Nos formations"
        subtitle="340 parcours certifiants adaptés à vos ambitions professionnelles"
      />

      {/* ===== CATALOGUE ===== */}
      <main className="max-w-[1200px] mx-auto py-[80px] px-6" id="main-content">
        {catalogue.map((category, index) => {
          // Détermine la variante de la carte selon la catégorie (ex: Image 1=Blanc, Image 2=Navy)
          // Tu peux aussi baser cela sur une propriété dans tes datas
          const isDarkSection = category.id === "management" || category.id === "digital"; 

          return (
            <section key={category.id} className="mb-[100px]" id={category.id}>
              
              {/* Header de catégorie (Image 9a22e3) */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div className="flex items-center group">
                  <div className="w-[6px] h-10 bg-orange rounded-full mr-4"></div>
                  <h2 className="font-heading text-2xl md:text-3xl font-[800] text-navy uppercase tracking-tight">
                    {category.label}
                  </h2>
                </div>
                
                {/* Bouton "Voir toutes" (Vu sur toutes tes images en haut à droite) */}
                <button className="btn-orange text-[12px] md:text-[13px] py-2 px-6 opacity-90 hover:opacity-100 self-start">
                  Voir toutes les formations
                </button>
              </div>

              {/* Grille de cartes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
                {category.items.map((item, idx) => (
                  <CardFormation 
                    key={idx}
                    title={item.titre}
                    image={item.imageUrl || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800"} // Image dynamique
                    points={item.features}
                    variant={isDarkSection ? "navy" : "white"} // Respect de l'alternance des visuels
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* ===== CTA FINAL ===== */}
      <section className="bg-[#F9FAFB] py-24 px-6 text-center border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl md:text-[38px] font-[800] text-navy mb-6 leading-tight">
            Besoin d'un conseil personnalisé ?
          </h2>
          <p className="text-muted font-body text-[16px] mb-12 leading-relaxed max-w-2xl mx-auto">
            Nos conseillers sont à votre écoute pour vous orienter vers la formation la plus adaptée à votre profil et vos financements.
          </p>
          <a 
            href="tel:0123456789" 
            className="btn-orange text-[15px] px-12 py-5 shadow-xl hover:-translate-y-1 inline-block"
          >
            Être rappelé gratuitement
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}