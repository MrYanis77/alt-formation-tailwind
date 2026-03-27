import { Link } from 'react-router-dom';
import ContactForm from './ContactForm';

const currentYear = new Date().getFullYear();

export default function Footer({ showContact = true }) {
  return (
    <>
      {showContact && <ContactForm />}

      <footer className="bg-footer px-10 pt-10 pb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-[30px]">
          
          {/* Colonne 1 : Formations */}
          <div className="flex flex-col">
            <h4 className="font-heading font-bold text-[13px] text-orange mb-[14px] uppercase tracking-wider">
              Formations
            </h4>
            <ul className="list-none p-0 m-0 space-y-2">
              <li><Link to="/formations#cybersecurite" className="text-[#aaa] text-[12px] hover:text-white transition-colors">Cybersécurité</Link></li>
              <li><Link to="/formations#management" className="text-[#aaa] text-[12px] hover:text-white transition-colors">Management</Link></li>
              <li><Link to="/formations#ressources-humaines" className="text-[#aaa] text-[12px] hover:text-white transition-colors">Ressources Humaines</Link></li>
              <li><Link to="/formations#digital" className="text-[#aaa] text-[12px] hover:text-white transition-colors">Digital</Link></li>
            </ul>
          </div>

          {/* Colonne 2 : Services */}
          <div className="flex flex-col">
            <h4 className="font-heading font-bold text-[13px] text-orange mb-[14px] uppercase tracking-wider">
              Services
            </h4>
            <ul className="list-none p-0 m-0 space-y-2">
              <li><Link to="/alternance" className="text-[#aaa] text-[12px] hover:text-white transition-colors">Alternance</Link></li>
              <li><Link to="/e-learning" className="text-[#aaa] text-[12px] hover:text-white transition-colors">E-learning</Link></li>
              <li><Link to="/financements" className="text-[#aaa] text-[12px] hover:text-white transition-colors">Financements</Link></li>
              <li><Link to="/entreprise" className="text-[#aaa] text-[12px] hover:text-white transition-colors">Solutions Entreprise</Link></li>
            </ul>
          </div>

          {/* Colonne 3 : À propos */}
          <div className="flex flex-col">
            <h4 className="font-heading font-bold text-[13px] text-orange mb-[14px] uppercase tracking-wider">
              À propos
            </h4>
            <ul className="list-none p-0 m-0 space-y-2">
              <li><Link to="/a-propos" className="text-[#aaa] text-[12px] hover:text-white transition-colors">Notre histoire</Link></li>
              <li><Link to="/a-propos#equipe" className="text-[#aaa] text-[12px] hover:text-white transition-colors">Notre équipe</Link></li>
              <li><Link to="/blog" className="text-[#aaa] text-[12px] hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="text-[#aaa] text-[12px] hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Colonne 4 : Mentions légales */}
          <div className="flex flex-col">
            <h4 className="font-heading font-bold text-[13px] text-orange mb-[14px] uppercase tracking-wider">
              Mentions légales
            </h4>
            <ul className="list-none p-0 m-0 space-y-2">
              <li><Link to="/politique-de-confidentialite" className="text-[#aaa] text-[12px] hover:text-white transition-colors">Politique de confidentialité</Link></li>
              <li><Link to="/conditions-generales" className="text-[#aaa] text-[12px] hover:text-white transition-colors">Conditions générales</Link></li>
              <li><Link to="/mentions-legales" className="text-[#aaa] text-[12px] hover:text-white transition-colors">Mentions légales</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright & Réseaux Sociaux */}
        <div className="border-t border-[#333] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-muted text-[12px]">
            &copy; {currentYear} ALT FORMATIONS. Tous droits réservés.
          </div>
          
          <div className="flex items-center gap-6">
            {/* Facebook */}
            <a href="https://www.facebook.com/altrhconsulting/" target="_blank" rel="noopener noreferrer" className="text-[#aaa] hover:text-orange transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            {/* Instagram */}
            <a href="https://www.instagram.com/altrhconsulting/" target="_blank" rel="noopener noreferrer" className="text-[#aaa] hover:text-orange transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/company/alt-rh/" target="_blank" rel="noopener noreferrer" className="text-[#aaa] hover:text-orange transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}