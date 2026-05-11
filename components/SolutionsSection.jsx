'use client';
import { useEffect, useRef } from 'react';
import styles from './SolutionsSection.module.css';

const solutions = [
    {
        icon: '🌐',
        title: 'Site web + Agent IA intégré',
        description: 'Un site vitrine ou e-commerce associé à un agent IA conversationnel qui engage vos visiteurs, répond à leurs questions et capture des leads automatiquement.',
        tag: 'Full-stack',
        accent: '#4F8EF7',
    },
    {
        icon: '🎯',
        title: 'Tunnel de conversion intelligent',
        description: 'Un funnel de vente optimisé par l\'IA qui qualifie vos prospects, les nourrit avec du contenu personnalisé et les convertit en clients avec un taux maximal.',
        tag: 'Marketing',
        accent: '#8B5CF6',
    },
    {
        icon: '🛒',
        title: 'Assistant IA e-commerce',
        description: 'Un assistant intelligent intégré à votre boutique qui recommande des produits, aide à la sélection, gère le support client et booste le panier moyen.',
        tag: 'E-commerce',
        accent: '#22D3EE',
    },
    {
        icon: '🧊',
        title: 'Visualisation 3D interactive',
        description: 'Transformez la présentation de vos produits avec des configurateurs 3D dans le navigateur. Laissez vos clients explorer, personaliser et vivre votre produit avant achat.',
        tag: 'Immersif',
        accent: '#4F8EF7',
    },
    {
        icon: '📊',
        title: 'Dashboard automatisé',
        description: 'Un tableau de bord sur mesure connecté à vos sources de données qui génère des rapports automatiques, alertes et insights en temps réel pour piloter votre business.',
        tag: 'Analytics',
        accent: '#8B5CF6',
    },
];

export default function SolutionsSection() {
    const itemsRef = useRef([]);

    useEffect(() => {
        (async () => {
            const { gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            itemsRef.current.forEach((item, i) => {
                if (!item) return;
                gsap.fromTo(
                    item,
                    { opacity: 0, x: i % 2 === 0 ? -30 : 30 },
                    {
                        opacity: 1, x: 0, duration: 0.7,
                        ease: 'power2.out',
                        scrollTrigger: { trigger: item, start: 'top 85%' },
                    }
                );
            });
        })();
    }, []);

    return (
        <section id="solutions" className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <div>
                        <p className="section-label">Solutions entreprises</p>
                        <h2 className={styles.heading}>
                            Ce que vous obtenez :<br />
                            <span className="gradient-text">des résultats, pas des promesses</span>
                        </h2>
                    </div>
                    <p className={styles.subtitle}>
                        Chaque solution est conçue pour s'intégrer à votre business et générer un impact mesurable, rapidement.
                    </p>
                </div>

                <div className={styles.list}>
                    {solutions.map((sol, i) => (
                        <div
                            key={sol.title}
                            ref={(el) => (itemsRef.current[i] = el)}
                            className={styles.item}
                            style={{ '--sol-accent': sol.accent }}
                        >
                            <div className={styles.itemLeft}>
                                <div className={styles.iconBox}>
                                    <span>{sol.icon}</span>
                                </div>
                                <div className={styles.connector} />
                            </div>
                            <div className={styles.itemBody}>
                                <div className={styles.itemHeader}>
                                    <h3 className={styles.itemTitle}>{sol.title}</h3>
                                    <span className={styles.itemTag}>{sol.tag}</span>
                                </div>
                                <p className={styles.itemDesc}>{sol.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
