import React from 'react';
import { useLocation } from 'react-router-dom';
import FaqSection from './FaqSection';
import { getFaqSectionProps } from '../data/pageFaqConfig';

export default function PageFaqSection() {
    const { pathname } = useLocation();
    const props = getFaqSectionProps(pathname);
    if (!props) return null;
    return <FaqSection {...props} />;
}
