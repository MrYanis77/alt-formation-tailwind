import CatalogueFormationsPage from '../components/CatalogueFormationsPage';
import { hero, catalogue, catalogueCourtes } from '../data/formations';
import { HardDrive, Code, Brain, Users, Calculator, Container, Cpu } from 'lucide-react';

const categoryIcons = {
  'cybersecurite-reseaux': <HardDrive className="w-6 h-6" />,
  'digital-developpement': <Code className="w-6 h-6" />,
  'ia-data': <Brain className="w-6 h-6" />,
  'ressources-humaines': <Users className="w-6 h-6" />,
  'comptabilite-gestion': <Calculator className="w-6 h-6" />,
  'devops-devsecops': <Container className="w-6 h-6" />,
  'systemes-embarques-iot': <Cpu className="w-6 h-6" />,
};

export default function FormationsPage() {
  return (
    <CatalogueFormationsPage
      hero={hero}
      breadcrumb="Formations Diplômantes"
      catalogue={catalogue}
      categoryIcons={categoryIcons}
      cta={{
        titre: "Besoin d'un conseil personnalisé ?",
        sousTitre: "Nos conseillers sont à votre écoute pour vous orienter vers la formation la plus adaptée à votre profil et vos financements.",
        bouton: "PRENDRE RENDEZ-VOUS",
        lien: "/contact",
      }}
      crossLinks={[
        { label: "Voir les formations certifiantes", to: "/formations-certifiantes" },
        { label: "Voir le catalogue E-Learning", to: "/e-learning" },
      ]}
    />
  );
}
