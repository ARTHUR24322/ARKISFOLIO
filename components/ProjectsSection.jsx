'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './ProjectsSection.module.css';

const projects = [
    {
        category: 'Web',
        title: 'Dashboard SaaS Analytics',
        problem: 'Une startup avait besoin d\'un tableau de bord analytique en temps réel pour visualiser ses KPIs',
        description: 'Application Next.js avec des graphiques animés, authentification et API REST intégrée.',
        stack: ['Next.js', 'GSAP', 'Node.js', 'PostgreSQL'],
        result: '+340% de clarté sur les données clés',
        gradient: 'linear-gradient(135deg, #1a1a4e 0%, #0f0f2e 100%)',
        accent: '#4F8EF7',
        emoji: '📊',
    },
    {
        category: 'Web',
        title: 'Site E-commerce Premium',
        problem: 'Une marque mode cherchait à augmenter ses conversions avec une expérience d\'achat premium',
        description: 'Site vitrine haut de gamme avec animations GSAP, panier temps réel et checkout optimisé.',
        stack: ['Next.js', 'Stripe', 'GSAP', 'Sanity CMS'],
        result: '+68% de taux de conversion',
        gradient: 'linear-gradient(135deg, #1a2e1a 0%, #0f1e0f 100%)',
        accent: '#22D3EE',
        emoji: '🛍️',
    },
    {
        category: '3D',
        title: 'Visualisation Produit 3D',
        problem: 'Une marque de montres voulait permettre à ses clients de voir le produit sous tous angles avant achat',
        description: 'Configurateur 3D interactif avec Three.js, rotations en temps réel et changement de matériaux.',
        stack: ['Three.js', 'React', 'Blender', 'WebGL'],
        result: '-45% de retours produits',
        gradient: 'linear-gradient(135deg, #2e1a3a 0%, #1e0f2a 100%)',
        accent: '#8B5CF6',
        emoji: '⌚',
    },
    {
        category: '3D',
        title: 'Expérience Immersive Metaverse',
        problem: 'Une agence créative souhaitait un site vitrine qui marque les esprits lors d\'un pitch client',
        description: 'Landing page avec scène 3D procédurale, particules interactives et scroll basé sur WebGL.',
        stack: ['Three.js', 'GSAP', 'Next.js', 'Shaders GLSL'],
        result: '3 clients convertis dès le jour 1',
        gradient: 'linear-gradient(135deg, #1a2a3a 0%, #0f1a2e 100%)',
        accent: '#22D3EE',
        emoji: '🌐',
    },
    {
        category: 'IA',
        title: 'Agent IA Support Client',
        problem: 'Un e-commerce gérait 800+ tickets/mois — impossible sans IA pour rester compétitif',
        description: 'Agent IA intégré au site, connecté à la base de données produits, capable de résoudre 80% des demandes.',
        stack: ['OpenAI API', 'Next.js', 'Pinecone', 'Webhooks'],
        result: '-80% de charge sur le support',
        gradient: 'linear-gradient(135deg, #2a1a1a 0%, #1e0f0f 100%)',
        accent: '#8B5CF6',
        emoji: '🤖',
    },
    {
        category: 'IA',
        title: 'Tunnel Génération de Leads IA',
        problem: 'Une startup B2B cherchait un système automatisé pour qualifier et relancer ses prospects',
        description: 'Pipeline IA complet : capture email, qualification NLP, séquences personnalisées et CRM automatisé.',
        stack: ['n8n', 'OpenAI', 'Airtable', 'Make.com'],
        result: '+220% de leads qualifiés',
        gradient: 'linear-gradient(135deg, #1a2a1a 0%, #0f1e0f 100%)',
        accent: '#4F8EF7',
        emoji: '🎯',
    },
];

const categories = ['Tous', 'Web', '3D', 'IA'];

export default function ProjectsSection() {
    const [active, setActive] = useState('Tous');
    const cardsRef = useRef([]);

    const filtered = active === 'Tous' ? projects : projects.filter((p) => p.category === active);

    useEffect(() => {
        (async () => {
            const { gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            gsap.fromTo(
                '.projects-title',
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: '#projects', start: 'top 80%' } }
            );
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const { gsap } = await import('gsap');
            gsap.fromTo(
                cardsRef.current.filter(Boolean),
                { opacity: 0, y: 30, scale: 0.97 },
                { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
            );
        })();
    }, [active]);

    return (
        <section id="projects" className={styles.section}>
            <div className="container">
                <p className="section-label">Projets</p>
                <h2 className={`${styles.heading} projects-title`}>
                    Des réalisations qui{' '}
                    <span className="gradient-text">parlent d'elles-mêmes</span>
                </h2>

                <div className={styles.filters}>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActive(cat)}
                            className={`${styles.filter} ${active === cat ? styles.filterActive : ''}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className={styles.grid}>
                    {filtered.map((project, i) => (
                        <div
                            key={project.title}
                            ref={(el) => (cardsRef.current[i] = el)}
                            className={styles.card}
                            style={{ '--project-accent': project.accent }}
                        >
                            <div className={styles.cardImage} style={{ background: project.gradient }}>
                                <span className={styles.cardEmoji}>{project.emoji}</span>
                                <span className={styles.cardBadge}>{project.category}</span>
                            </div>
                            <div className={styles.cardBody}>
                                <h3 className={styles.cardTitle}>{project.title}</h3>
                                <p className={styles.problem}>
                                    <strong>Problème :</strong> {project.problem}
                                </p>
                                <p className={styles.cardDesc}>{project.description}</p>
                                <div className={styles.stack}>
                                    {project.stack.map((s) => (
                                        <span key={s} className={styles.stackTag}>{s}</span>
                                    ))}
                                </div>
                                <div className={styles.result}>
                                    <span className={styles.resultIcon}>✦</span>
                                    <span>{project.result}</span>
                                </div>
                                <button className={styles.cta}>
                                    Voir le projet
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
