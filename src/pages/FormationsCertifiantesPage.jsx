import CatalogueFormationsPage from '../components/CatalogueFormationsPage';
import { catalogueCertifiantes, heroCertifiantes } from '../data/formations';
import { Container } from 'lucide-react';

const categoryIcons = {
  'devops':    <Container className="w-6 h-6" />,
  'devsecops': <Container className="w-6 h-6" />,
};

export default function FormationsCertifiantesPage() {
  return (
    <CatalogueFormationsPage
      hero={heroCertifiantes}
      breadcrumb="Formations Certifiantes"
      catalogue={catalogueCertifiantes}
      categoryIcons={categoryIcons}
      cta={{
        titre: "Prêt à décrocher votre certification ?",
        sousTitre: "Formations disponibles en Inter ou Intra-Entreprise. Contactez-nous pour planifier une session adaptée à vos besoins.",
        bouton: "NOUS CONTACTER",
        lien: "/contact",
      }}
      crossLinks={[
        { label: "Voir les formations diplômantes", to: "/formations" },
        { label: "Voir le catalogue E-Learning", to: "/e-learning" },
      ]}
    />
  );
}
