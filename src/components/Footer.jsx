import { Link } from 'react-router-dom';
import ContactForm from './ContactForm';

const currentYear = new Date().getFullYear();

export default function Footer({ showContact = true }) {
  return (
    <>
      {/* Formulaire de contact (masquable sur la page Contact) */}
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
              <li><Link to="/confidentialite" className="text-[#aaa] text-[12px] hover:text-white transition-colors">Politique de confidentialité</Link></li>
              <li><Link to="/cgv" className="text-[#aaa] text-[12px] hover:text-white transition-colors">Conditions générales</Link></li>
              <li><Link to="/mentions-legales" className="text-[#aaa] text-[12px] hover:text-white transition-colors">Mentions légales</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#333] pt-4 text-center text-muted text-[12px]">
          &copy; {currentYear} ALT FORMATIONS. Tous droits réservés.
        </div>
      </footer>
    </>
  );
}