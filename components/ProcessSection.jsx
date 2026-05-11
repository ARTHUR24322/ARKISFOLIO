'use client';
import { useEffect, useRef } from 'react';
import styles from './ProcessSection.module.css';

const steps = [
    {
        num: '01',
        title: 'Analyse & Stratégie',
        description: 'Un appel découverte pour comprendre vos objectifs, votre audience, vos contraintes techniques et vos enjeux business. On définit ensemble la meilleure approche.',
        icon: '🔍',
        delivrable: 'Brief stratégique + roadmap',
    },
    {
        num: '02',
        title: 'Design & Prototypage',
        description: 'Conception des maquettes UI/UX, wireframes et prototypes interactifs. Vous validez l\'expérience utilisateur avant qu\'une ligne de code soit écrite.',
        icon: '✏️',
        delivrable: 'Maquettes Figma + prototype',
    },
    {
        num: '03',
        title: 'Développement & Intégration IA',
        description: 'Développement du site, des animations et des systèmes IA avec une approche agile. Points d\'avancement réguliers et itérations rapides.',
        icon: '⚡',
        delivrable: 'Site live en staging + agents IA',
    },
    {
        num: '04',
        title: 'Livraison & Optimisation',
        description: 'Mise en production, tests de performance, SEO optimisé et formation. Suivi post-livraison pour garantir que tout performe à 100%.',
        icon: '🚀',
        delivrable: 'Site live + documentation + support',
    },
];

export default function ProcessSection() {
    const stepsRef = useRef([]);
    const lineRef = useRef(null);

    useEffect(() => {
        (async () => {
            const { gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            stepsRef.current.forEach((step, i) => {
                if (!step) return;
                gsap.fromTo(
                    step,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1, y: 0, duration: 0.7, delay: i * 0.15,
                        ease: 'power3.out',
                        scrollTrigger: { trigger: '#process', start: 'top 75%' },
                    }
                );
            });

            if (lineRef.current) {
                gsap.fromTo(
                    lineRef.current,
                    { scaleX: 0 },
                    {
                        scaleX: 1, duration: 1.4, ease: 'power2.inOut',
                        scrollTrigger: { trigger: '#process', start: 'top 70%' },
                    }
                );
            }
        })();
    }, []);

    return (
        <section id="process" className={styles.section}>
            <div className="container">
                <p className="section-label">Comment je travaille</p>
                <h2 className={styles.heading}>
                    Un process rodé pour des{' '}
                    <span className="gradient-text">résultats prévisibles</span>
                </h2>

                <div className={styles.wrapper}>
                    <div className={styles.progressLine}>
                        <div ref={lineRef} className={styles.progressFill} />
                    </div>

                    <div className={styles.steps}>
                        {steps.map((step, i) => (
                            <div
                                key={step.num}
                                ref={(el) => (stepsRef.current[i] = el)}
                                className={styles.step}
                                style={{ opacity: 0 }}
                            >
                                <div className={styles.stepTop}>
                                    <div className={styles.stepNum}>{step.num}</div>
                                    <div className={styles.stepDot} />
                                </div>
                                <div className={styles.stepIcon}>{step.icon}</div>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepDesc}>{step.description}</p>
                                <div className={styles.delivrable}>
                                    <span className={styles.delivrableIcon}>→</span>
                                    {step.delivrable}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
