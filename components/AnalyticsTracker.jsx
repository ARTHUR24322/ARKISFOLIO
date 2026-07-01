'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
    const pathname = usePathname();

    useEffect(() => {
        // Enregistrer une visite au chargement ou lors d'un changement de route
        const trackVisit = async () => {
            try {
                const lastVisit = sessionStorage.getItem('last_visit_time');
                const now = new Date().getTime();
                
                // Enregistre uniquement si c'est une nouvelle session ou si plus de 30 minutes se sont écoulées
                if (!lastVisit || (now - parseInt(lastVisit) > 30 * 60 * 1000)) {
                    await fetch('/api/analytics', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ type: 'visit', path: pathname }),
                        cache: 'no-store' // Éviter que Vercel mette en cache la requête
                    });
                    sessionStorage.setItem('last_visit_time', now.toString());
                }
            } catch (err) {
                // Silencieux pour ne pas déranger l'utilisateur
            }
        };

        trackVisit();
    }, [pathname]);

    return null; // Composant invisible
}
