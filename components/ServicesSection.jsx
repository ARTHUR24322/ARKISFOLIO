'use client';
import { useEffect, useRef } from 'react';
import styles from './ServicesSection.module.css';

const services = [
    {
        icon: '💻',
        title: 'Développement Web',
        subtitle: 'Sites qui performent et convertissent',
        description:
            'Sites modernes, performants et animés. Applications web réactives avec les dernières technologies. Chaque projet est optimisé pour la vitesse, le SEO et l\'expérience utilisateur.',
        points: ['Single Page Apps (Next.js, React)', 'Animations GSAP & micro-interactions', 'Performance & Core Web Vitals', 'E-commerce & solutions SaaS'],
        color: '#4F8EF7',
    },
    {
        icon: '🧊',
        title: 'Design 3D',
        subtitle: 'Visuels qui marquent les esprits',
        description:
            'Visualisations produit, animations 3D, expériences immersives dans le navigateur. Donnez vie à votre marque avec des rendus qui captivent et différencient.',
        points: ['Scènes Three.js interactives', 'Rendu produit & visualisation', 'Animations Blender / Cinema 4D', 'Expériences immersives WebGL'],
        color: '#22D3EE',
    },
    {
        icon: '🤖',
        title: 'Agents IA',
        subtitle: 'Automatisation intelligente pour votre business',
        description:
            'Création d\'agents intelligents qui travaillent pour vous 24h/24. Automatisez vos processus métier et multipliez votre productivité avec l\'IA.',
        points: ['Chatbots & assistants IA', 'Génération de leads automatisée', 'Support client 24/7', 'Intégration IA sur site web'],
        color: '#8B5CF6',
    },
];

export default function ServicesSection() {
    const sectionRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        (async () => {
            const { gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            cardsRef.current.forEach((card, i) => {
                gsap.fromTo(
                    card,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1, y: 0, duration: 0.8, delay: i * 0.15,
                        ease: 'power3.out',
                        scrollTrigger: { trigger: card, start: 'top 85%' },
                    }
                );
            });
        })();
    }, []);

    return (
        <section id="services" className={styles.section} ref={sectionRef}>
            <div className="container">
                <p className="section-label">Ce que je fais</p>
                <h2 className={styles.heading}>
                    Des solutions digitales qui créent{' '}
                    <span className="gradient-text">de la valeur réelle</span>
                </h2>
                <p className={styles.subheading}>
                    De la conception à la livraison, je transforme vos idées en produits digitaux qui génèrent des résultats mesurables.
                </p>

                <div className={styles.grid}>
                    {services.map((s, i) => (
                        <div
                            key={s.title}
                            ref={(el) => (cardsRef.current[i] = el)}
                            className={styles.card}
                            style={{ '--card-color': s.color }}
                            onMouseMove={(e) => {
                                const card = e.currentTarget;
                                const rect = card.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const y = e.clientY - rect.top;
                                card.style.setProperty('--mouse-x', `${x}px`);
                                card.style.setProperty('--mouse-y', `${y}px`);
                            }}
                        >
                            <div className={styles.cardTop}>
                                <div className={styles.iconWrap}>
                                    <span className={styles.icon}>{s.icon}</span>
                                </div>
                                <div className={styles.cardHeader}>
                                    <h3 className={styles.cardTitle}>{s.title}</h3>
                                    <p className={styles.cardSubtitle}>{s.subtitle}</p>
                                </div>
                            </div>
                            <p className={styles.cardDesc}>{s.description}</p>
                            <ul className={styles.points}>
                                {s.points.map((p) => (
                                    <li key={p} className={styles.point}>
                                        <span className={styles.pointDot} />
                                        {p}
                                    </li>
                                ))}
                            </ul>
                            <div className={styles.cardGlow} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
