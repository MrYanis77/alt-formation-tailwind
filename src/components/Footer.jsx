import { Link } from 'react-router-dom';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <>
      <footer className="bg-footer px-10 pt-10 pb-5 border-t-4 border-accent">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-[30px]">

          {/* Colonne 1 : Nos Parcours */}
          <div className="flex flex-col">
            <h4 className="font-heading font-bold text-small text-accent mb-[14px] uppercase tracking-wider">
              Nos Parcours
            </h4>
            <ul className="list-none p-0 m-0 space-y-2">
              <li><Link to="/formations" className="text-gray-300 text-sm hover:text-white transition-colors">Toutes nos formations</Link></li>
              <li><Link to="/formations#numerique" className="text-gray-300 text-sm hover:text-white transition-colors">Filière Numérique</Link></li>
              <li><Link to="/formations#gestion-rh" className="text-gray-300 text-sm hover:text-white transition-colors">Filière Gestion & RH</Link></li>
              <li><Link to="/certification" className="text-gray-300 text-sm hover:text-white transition-colors">Certifications</Link></li>
            </ul>
          </div>

          {/* Colonne 2 : Solutions & Accompagnement */}
          <div className="flex flex-col">
            <h4 className="font-heading font-bold text-small text-accent mb-[14px] uppercase tracking-wider">
              Accompagnement
            </h4>
            <ul className="list-none p-0 m-0 space-y-2">
              <li><Link to="/alternance" className="text-gray-300 text-sm hover:text-white transition-colors">Alternance</Link></li>
              <li><Link to="/e-learning" className="text-gray-300 text-sm hover:text-white transition-colors">E-learning</Link></li>
              <li><Link to="/financements" className="text-gray-300 text-sm hover:text-white transition-colors">Financements</Link></li>
              <li><Link to="/entreprise" className="text-gray-300 text-sm hover:text-white transition-colors">Solutions Entreprises</Link></li>
              <li><Link to="/coaching-emploi" className="text-gray-300 text-sm hover:text-white transition-colors">Coaching Emploi</Link></li>
              <li><Link to="/gestion-carrieres" className="text-gray-300 text-sm hover:text-white transition-colors">Gestion des Carrières</Link></li>
            </ul>
          </div>

          {/* Colonne 3 : ALT Formations */}
          <div className="flex flex-col">
            <h4 className="font-heading font-bold text-small text-accent mb-[14px] uppercase tracking-wider">
              ALT Formations
            </h4>
            <ul className="list-none p-0 m-0 space-y-2">
              <li><Link to="/a-propos" className="text-gray-300 text-sm hover:text-white transition-colors">À propos</Link></li>
              <li><Link to="/campus" className="text-gray-300 text-sm hover:text-white transition-colors">Nos Campus</Link></li>
              <li><Link to="/nous-rejoindre" className="text-gray-300 text-sm hover:text-white transition-colors">Nous rejoindre</Link></li>
              <li><Link to="/faq" className="text-gray-300 text-sm hover:text-white transition-colors">F.A.Q.</Link></li>
              <li><Link to="/ressources-ia" className="text-gray-300 text-sm hover:text-white transition-colors">Ressources IA</Link></li>
              <li><Link to="/contact" className="text-gray-300 text-sm hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Colonne 4 : Mentions légales */}
          <div className="flex flex-col">
            <h4 className="font-heading font-bold text-small text-accent mb-[14px] uppercase tracking-wider">
              Informations Légales
            </h4>
            <ul className="list-none p-0 m-0 space-y-2">
              <li><Link to="/mentions-legales" className="text-gray-300 text-sm hover:text-white transition-colors">Mentions légales</Link></li>
              <li><Link to="/politique-de-confidentialite" className="text-gray-300 text-sm hover:text-white transition-colors">Politique de confidentialité</Link></li>
              <li><Link to="/conditions-generales" className="text-gray-300 text-sm hover:text-white transition-colors">Conditions générales</Link></li>
            </ul>

            {/* Logo Qualiopi et Certificat PDF */}
            <div className="mt-8 pt-6 border-t border-[#4a4545] flex flex-col items-start gap-4">
              <div className="bg-white p-2 rounded-xl shadow-md inline-block">
                <img
                  src="/Assets/images/qualiopi.png"
                  alt="Certification Qualiopi"
                  className="h-20 w-auto object-contain block"
                />
              </div>
              <a
                href="/Assets/documents/CERTIFICATION QUALIOPI ALT RH CONSULTING.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-accent text-xs font-bold hover:underline"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Télécharger le certificat PDF
              </a>
            </div>
          </div>
        </div>

        {/* Copyright & Réseaux Sociaux */}
        <div className="border-t border-[#4a4545] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm">
            &copy; {currentYear} ALT FORMATIONS. Tous droits réservés.
          </div>

          <div className="flex items-center gap-6">
            {/* Facebook */}
            <a href="https://www.facebook.com/altrhconsulting/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            {/* Instagram */}
            <a href="https://www.instagram.com/altrhconsulting/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/alt-rh-formations-0492813bb/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}