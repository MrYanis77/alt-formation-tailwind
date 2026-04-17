import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Structure globale
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageLoader from './components/Items/PageLoader';

// Pages - Lazy loading pour optimiser les performances
const HomePage = lazy(() => import('./pages/HomePage'));
const FormationsPage = lazy(() => import('./pages/FormationsPage'));
const ElearningPage = lazy(() => import('./pages/ElearningPage'));
const AlternancePage = lazy(() => import('./pages/AlternancePage'));
const FinancementPage = lazy(() => import('./pages/FinancementPage'));
const EntreprisePage = lazy(() => import('./pages/EntreprisePage'));
const AproposPage = lazy(() => import('./pages/AproposPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ConnexionPage = lazy(() => import('./pages/ConnexionPage'));
const InscriptionPage = lazy(() => import('./pages/InscriptionPage'));
const FormationDetail = lazy(() => import('./pages/FormationDetail'));
const CampusPage = lazy(() => import('./pages/CampusPages'));
const CertificationPage = lazy(() => import('./pages/CertificationPage'));
const NousRejoindre = lazy(() => import('./pages/NousRejoindrePage'));
const MentionsLegales = lazy(() => import('./pages/MentionsLegales'));
const PolitiqueConfidentialite = lazy(() => import('./pages/PolitiqueConfidentialite'));
const ReglementInterieur = lazy(() => import('./pages/ReglementInterieur'));
const PolitiqueCookies = lazy(() => import('./pages/PolitiqueCookies'));
const RessourcesIAPages = lazy(() => import('./pages/RessourcesIAPages'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const GestionCarriere = lazy(() => import('./pages/GestionCarriere'));
const CoachingPage = lazy(() => import('./pages/CoachingPage'));

// --- NOUVELLE PAGE AJOUTÉE ICI ---
const CarrierePage = lazy(() => import('./pages/CarrierePage'));

function ComingSoon({ title }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 font-heading text-primary">
      <h1 className="text-3xl font-extrabold">{title}</h1>
      <p className="text-content-muted font-body">Page en cours de construction — en attente du screenshot.</p>
    </div>
  );
}

export default function App() {
  // Les polices sont maintenant gérées statiquement dans index.html pour éviter le FOUT

  return (
    <BrowserRouter>
      {/* Gestion de restauration du scroll global */}
      <ScrollToTop />

      {/* La Navbar sera visible sur toutes les pages */}
      <Navbar />

      <main className="min-h-screen">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Redirection racine vers accueil */}
            <Route path="/" element={<Navigate to="/accueil" replace />} />

            {/* Pages Principales */}
            <Route path="/accueil" element={<HomePage />} />
            <Route path="/formations" element={<FormationsPage />} />
            <Route path="/alternance" element={<AlternancePage />} />
            <Route path="/e-learning" element={<ElearningPage />} />
            <Route path="/financements" element={<FinancementPage />} />
            <Route path="/entreprise" element={<EntreprisePage />} />

            {/* Autres Pages */}
            <Route path="/a-propos" element={<AproposPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/inscription" element={<InscriptionPage />} />
            <Route path="/connexion" element={<ConnexionPage />} />
            <Route path="/formation/:id" element={<FormationDetail />} />
            <Route path="/campus" element={<CampusPage />} />
            <Route path="/certification" element={<CertificationPage />} />

            {/* --- NOUVELLE ROUTE AJOUTÉE ICI --- */}
            <Route path="/carriere" element={<CarrierePage />} />
            <Route path="/gestion-carrieres" element={<GestionCarriere />} />
            <Route path="/coaching-emploi" element={<CoachingPage />} />

            <Route path="/ressources-ia" element={<RessourcesIAPages />} />
            <Route path="/nous-rejoindre" element={<NousRejoindre />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
            <Route path="/conditions-generales" element={<PolitiqueCookies />} />

            {/* 404 */}
            <Route path="*" element={<ComingSoon title="Page introuvable" />} />
          </Routes>
        </Suspense>
      </main>

      {/* Le Footer sera visible sur toutes les pages */}
      <Footer />
    </BrowserRouter>
  );
}