'use client';
import { useEffect, useState } from 'react';
import styles from './ShootingStars.module.css';

export default function ShootingStars() {
    const [stars, setStars] = useState([]);

    useEffect(() => {
        // Optimisation pour ne pas surcharger d'étoiles
        let isMounted = true;
        let starId = 0;

        const createStar = () => {
            if (!isMounted) return;
            
            const star = {
                id: starId++,
                // Départ aléatoire haut ou à gauche
                top: `${Math.random() * 80 - 20}%`,
                left: `${Math.random() * 80 - 20}%`,
                animationDuration: `${Math.random() * 2 + 1.5}s`,
                animationDelay: `${Math.random() * 2}s`,
            };
            
            setStars(prev => [...prev, star]);

            // Nettoyage après l'animation
            setTimeout(() => {
                if (isMounted) {
                    setStars(prev => prev.filter(s => s.id !== star.id));
                }
            }, 4000);
        };

        const interval = setInterval(createStar, 1200); // Génération modérée

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    return (
        <div className={styles.starsContainer}>
            {stars.map(star => (
                <div 
                    key={star.id} 
                    className={styles.star} 
                    style={{ 
                        top: star.top, 
                        left: star.left, 
                        animationDuration: star.animationDuration,
                        animationDelay: star.animationDelay
                    }} 
                />
            ))}
        </div>
    );
}
