import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Structure globale
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import FormationsPage from './pages/FormationsPage';
import ElearningPage from './pages/ElearningPage';
import AlternancePage from './pages/AlternancePage';
import FinancementPage from './pages/FinancementPage';
import EntreprisePage from './pages/EntreprisePage';
import AproposPage from './pages/AproposPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import ConnexionPage from './pages/ConnexionPage';
import InscriptionPage from './pages/InscriptionPage';
import FormationDetail from './pages/FormationDetail';
import CampusPage from './pages/CampusPages';
import CertificationPage from './pages/CertificationPage';
import NousRejoindre from './pages/NousRejoindrePage';
import MentionsLegales from './pages/MentionsLegales';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import ReglementInterieur from './pages/ReglementInterieur';
import PolitiqueCookies from './pages/PolitiqueCookies';


function ComingSoon({ title }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 font-heading text-navy">
      <h1 className="text-3xl font-extrabold">{title}</h1>
      <p className="text-muted font-body">Page en cours de construction — en attente du screenshot.</p>
    </div>
  );
}

export default function App() {
  /* Chargement dynamique de Google Fonts */
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Open+Sans:wght@400;600&display=swap';
    document.head.appendChild(link);
  }, []);

  return (
    <BrowserRouter>
      {/* Gestion de restauration du scroll global */}
      <ScrollToTop />

      {/* La Navbar sera visible sur toutes les pages */}
      <Navbar />

      <main className="min-h-screen">
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
         

          {/* Placeholders */}
          <Route path="/a-propos" element={<AproposPage/>} />
          <Route path="/blog" element={<BlogPage/>} />
          <Route path="/contact" element={<ContactPage/>} />
          <Route path="/inscription" element={<InscriptionPage/>} />
          <Route path="/connexion" element={<ConnexionPage/>} />
          <Route path="/formation/:id" element={<FormationDetail />} />
          <Route path="/campus" element={<CampusPage/>} />
          <Route path="/certification" element={<CertificationPage/>} />
          <Route path="/nous-rejoindre" element={<NousRejoindre/>} />
          <Route path="/mentions-legales" element={<MentionsLegales/>} />
          <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialite/>} />
          <Route path="/conditions-generales" element={<PolitiqueCookies/>} />
          {/* 404 */}
          <Route path="*" element={<ComingSoon title="Page introuvable" />} />
        </Routes>
      </main>

      {/* Le Footer sera visible sur toutes les pages */}
      <Footer />
    </BrowserRouter>
  );
}