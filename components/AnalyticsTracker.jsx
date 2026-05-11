'use client';
import { useEffect } from 'react';

export default function AnalyticsTracker() {
    useEffect(() => {
        // Enregistrer une visite au chargement
        const trackVisit = async () => {
            try {
                // Utilisation d'un flag session pour éviter de compter plusieurs fois par session
                if (!sessionStorage.getItem('site_visited')) {
                    await fetch('/api/analytics', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ type: 'visit' }),
                    });
                    sessionStorage.setItem('site_visited', 'true');
                }
            } catch (err) {
                // Silencieux pour ne pas déranger l'utilisateur
            }
        };

        trackVisit();
    }, []);

    return null; // Composant invisible
}
