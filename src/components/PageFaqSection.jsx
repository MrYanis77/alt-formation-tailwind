import React from 'react';
import { useLocation } from 'react-router-dom';
import FaqSection from './FaqSection';
import { getFaqSectionProps } from '../data/pageFaqConfig';

export default function PageFaqSection() {
    const { pathname } = useLocation();
    const props = getFaqSectionProps(pathname);
    if (!props) return null;
    /* Remonte la FAQ à chaque route pour réinitialiser l’aperçu (10 questions) et « Voir le reste » */
    return <FaqSection key={pathname} {...props} />;
}
