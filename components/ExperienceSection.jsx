'use client';
import { useEffect, useRef } from 'react';
import styles from './ExperienceSection.module.css';

const experiences = [
    {
        year: '2024 — Présent',
        role: 'Développeur Fullstack & Expert IA',
        company: 'Freelance / Arthur Dev',
        desc: 'Conception d\'architectures web modernes avec Next.js et intégration d\'agents IA autonomes pour l\'automatisation d\'entreprises.',
        tags: ['Next.js', 'OpenAI', 'Supabase', 'TypeScript']
    },
    {
        year: '2023 — 2024',
        role: 'Designer 3D & Développeur Front-end',
        company: 'Studio Digital',
        desc: 'Création d\'interfaces immersives utilisant Three.js et GSAP. Optimisation des performances WebGL et UX design.',
        tags: ['Three.js', 'GSAP', 'WebGL', 'React']
    },
    {
        year: '2022 — 2023',
        role: 'Développeur Web Junior',
        company: 'Tech Startup',
        desc: 'Développement de dashboards complexes et intégration d\'APIs tierces. Maintenance de PWA et systèmes de paiement.',
        tags: ['React', 'Node.js', 'Tailwind', 'PostgreSQL']
    }
];

export default function ExperienceSection() {
    const itemsRef = useRef([]);

    useEffect(() => {
        (async () => {
            const { gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            itemsRef.current.forEach((el, i) => {
                gsap.fromTo(el,
                    { opacity: 0, x: -30 },
                    {
                        opacity: 1, x: 0,
                        duration: 0.8,
                        delay: i * 0.1,
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 85%',
                        }
                    }
                );
            });
        })();
    }, []);

    return (
        <section id="experience" className={styles.section}>
            <div className="container">
                <p className="section-label">Parcours</p>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        Expériences & <span className="gradient-text">Formations</span>
                    </h2>
                    <a 
                        href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cv/cv_arthur_kisumbule.pdf`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={styles.cvBtn}
                    >
                        Télécharger PDF
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 13h12M8 2v8M4 7l4 4 4-4" />
                        </svg>
                    </a>
                </div>

                <div className={styles.timeline}>
                    {experiences.map((exp, i) => (
                        <div 
                            key={i} 
                            ref={el => itemsRef.current[i] = el}
                            className={styles.item}
                        >
                            <div className={styles.dot} />
                            <div className={styles.year}>{exp.year}</div>
                            <div className={styles.content}>
                                <h3 className={styles.role}>{exp.role}</h3>
                                <p className={styles.company}>{exp.company}</p>
                                <p className={styles.desc}>{exp.desc}</p>
                                <div className={styles.tags}>
                                    {exp.tags.map(tag => (
                                        <span key={tag} className={styles.tag}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
