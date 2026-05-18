import { lazy, Suspense } from 'react';
<<<<<<< HEAD
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
=======
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03

import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageLoader from './components/Items/PageLoader';
// import RequireAuth from './components/RequireAuth';
// import ChatWidget from './components/Chat/ChatWidget';
// import { AuthProvider } from './context/AuthContext';
// import usePageTracking from './hooks/usePageTracking';

const HomePage = lazy(() => import('./pages/HomePage'));
const FormationsPage = lazy(() => import('./pages/FormationsPage'));
<<<<<<< HEAD
=======
const ElearningPage = lazy(() => import('./pages/ElearningPage'));
>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03
const AlternancePage = lazy(() => import('./pages/AlternancePage'));
const FinancementPage = lazy(() => import('./pages/FinancementPage'));
const EntreprisePage = lazy(() => import('./pages/EntreprisePage'));
const AproposPage = lazy(() => import('./pages/AproposPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
// const ConnexionPage = lazy(() => import('./pages/ConnexionPage'));
// const InscriptionPage = lazy(() => import('./pages/InscriptionPage'));
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
const CarrierePage = lazy(() => import('./pages/CarrierePage'));
const BilanDeCompetencePage = lazy(() => import('./pages/BilanDeCompetencePage'));
<<<<<<< HEAD
/** Anciennes URLs → catalogue unifié (ancres conservées pour les domaines). */
function RedirectFormationCatalogTab({ tab }) {
  const { hash } = useLocation();
  const raw = (hash || '').replace(/^#/, '');

  if (tab === 'diplomantes') {
    return <Navigate to={`/formations${hash}`} replace />;
  }

  if (tab === 'elearning') {
    return <Navigate to={`/formations?type=elearning${hash}`} replace />;
  }

  // certifiantes : tout sur /formations avec ancres #certifiantes / #certifiantes-<cat>
  if (!raw) {
    return <Navigate to="/formations#certifiantes" replace />;
  }
  if (raw === 'certifiantes' || raw.startsWith('certifiantes-')) {
    return <Navigate to={`/formations#${raw}`} replace />;
  }
  // Ancien #cybersecurite-reseaux seul sur /formations-certifiantes
  return <Navigate to={`/formations#certifiantes-${raw}`} replace />;
}
=======
const FormationsCertifiantesPage = lazy(() => import('./pages/FormationsCertifiantesPage'));
>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03

// const UserDashboard = lazy(() => import('./pages/UserDashboard'));
// const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function ComingSoon({ title }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 font-heading text-primary">
      <h1 className="text-3xl font-extrabold">{title}</h1>
      <p className="text-content-muted font-body">Page en cours de construction.</p>
    </div>
  );
}

function AppShell() {
  // usePageTracking();

  return (
    <>
      <ScrollToTop />
      <Navbar />

      <main className="min-h-screen">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/accueil" replace />} />

            <Route path="/accueil" element={<HomePage />} />
            <Route path="/formations" element={<FormationsPage />} />
            <Route path="/alternance" element={<AlternancePage />} />
<<<<<<< HEAD
            <Route path="/e-learning" element={<RedirectFormationCatalogTab tab="elearning" />} />
            <Route path="/formations-courtes" element={<RedirectFormationCatalogTab tab="elearning" />} />
            <Route path="/formations-certifiantes" element={<RedirectFormationCatalogTab tab="certifiantes" />} />
=======
            <Route path="/e-learning" element={<ElearningPage />} />
            <Route path="/formations-courtes" element={<Navigate to="/e-learning" replace />} />
            <Route path="/formations-certifiantes" element={<FormationsCertifiantesPage />} />
>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03
            <Route path="/financements" element={<FinancementPage />} />
            <Route path="/entreprise" element={<EntreprisePage />} />

            <Route path="/a-propos" element={<AproposPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* <Route path="/inscription" element={<InscriptionPage />} /> */}
            {/* <Route path="/connexion" element={<ConnexionPage />} /> */}
            <Route path="/formation/:id" element={<FormationDetail />} />
            <Route path="/campus" element={<CampusPage />} />
            <Route path="/certification" element={<CertificationPage />} />

            <Route path="/carrieres" element={<CarrierePage />} />
            <Route path="/carriere" element={<Navigate to="/carrieres" replace />} />
            <Route path="/gestion-carrieres" element={<Navigate to="/carrieres" replace />} />
            <Route path="/coaching-emploi" element={<Navigate to="/carrieres" replace />} />

            <Route path="/bilan-de-competences" element={<BilanDeCompetencePage />} />

            <Route path="/ressources-ia" element={<RessourcesIAPages />} />
            <Route path="/nous-rejoindre" element={<NousRejoindre />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
            <Route path="/conditions-generales" element={<PolitiqueCookies />} />
            <Route path="/reglement-interieur" element={<ReglementInterieur />} />

            {/*
            <Route
              path="/mon-espace"
              element={
                <RequireAuth denyAdmin>
                  <UserDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/admin"
              element={
                <RequireAuth adminOnly>
                  <AdminDashboard />
                </RequireAuth>
              }
            />
            */}

            <Route path="*" element={<ComingSoon title="Page introuvable" />} />
          </Routes>
        </Suspense>
      </main>

      {/* <ChatWidget /> */}

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* <AuthProvider> */}
        <AppShell />
      {/* </AuthProvider> */}
    </BrowserRouter>
  );
}
