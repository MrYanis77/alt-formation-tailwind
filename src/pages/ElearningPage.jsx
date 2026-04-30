import CatalogueFormationsPage from '../components/CatalogueFormationsPage';
import { catalogueCourtes } from '../data/formations';
import { hero } from '../data/elearning';
import { Shield, Code, Users, Container, Monitor, Cpu } from 'lucide-react';

const categoryIcons = {
  'cybersecurite': <Shield className="w-6 h-6" />,
  'digital-developpement': <Code className="w-6 h-6" />,
  'management': <Users className="w-6 h-6" />,
  'devops-devsecops': <Container className="w-6 h-6" />,
  'informatique-systemes-reseaux': <Monitor className="w-6 h-6" />,
  'systemes-embarques-iot': <Cpu className="w-6 h-6" />,
};

export default function ElearningPage() {
  return (
    <CatalogueFormationsPage
      hero={hero}
      breadcrumb="E-Learning"
      catalogue={catalogueCourtes}
      categoryIcons={categoryIcons}
      cta={{
        titre: "Une formation sur mesure ?",
        sousTitre: "Nos conseillers peuvent adapter le contenu et le planning de toute formation courte à votre équipe ou vos besoins spécifiques.",
        bouton: "NOUS CONTACTER",
        lien: "/contact",
      }}
      crossLinks={[
        { label: "Voir les formations diplômantes", to: "/formations" },
        { label: "Voir les formations certifiantes", to: "/formations-certifiantes" },
      ]}
    />
  );
}
