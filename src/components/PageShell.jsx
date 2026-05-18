import React from 'react';
import { Outlet } from 'react-router-dom';
import PageFaqSection from './PageFaqSection';

export default function PageShell() {
    return (
        <>
            <Outlet />
            <PageFaqSection />
        </>
    );
}
