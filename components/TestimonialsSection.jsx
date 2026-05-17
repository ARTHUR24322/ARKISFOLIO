'use client';
import { useEffect, useRef } from 'react';
import styles from './TestimonialsSection.module.css';

const testimonials = [
    {
        name: 'Sarah Benali',
        role: 'CEO @ TechFlow',
        content: 'L\'expertise d\'Arthur en IA a transformé notre service client. L\'agent qu\'il a conçu traite maintenant 70% de nos demandes automatiquement avec une précision bluffante.',
        avatar: 'SB',
        rating: 5,
    },
    {
        name: 'Thomas Laurent',
        role: 'Fondateur de Chronos 3D',
        content: 'Un designer hors pair. Le configurateur 3D qu\'il a développé pour nos produits a réduit nos retours de 40% et augmenté nos ventes de manière significative.',
        avatar: 'TL',
        rating: 5,
    },
    {
        name: 'Elena Rodriguez',
        role: 'Directrice Marketing @ VibeMedia',
        content: 'Collaborer avec Arthur a été une expérience fluide. Sa capacité à mélanger développement web et design créatif est rare. Je recommande les yeux fermés !',
        avatar: 'ER',
        rating: 5,
    }
];

export default function TestimonialsSection() {
    const sectionRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        (async () => {
            const { gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            gsap.fromTo(
                sectionRef.current,
                { opacity: 0, y: 40 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8, 
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 85%',
                    }
                }
            );

            gsap.fromTo(
                cardsRef.current,
                { opacity: 0, y: 30, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%',
                    }
                }
            );
        })();
    }, []);

    return (
        <section id="testimonials" className={styles.section} ref={sectionRef}>
            <div className="container">
                <p className="section-label">Témoignages</p>
                <h2 className={styles.heading}>
                    Ce qu'ils disent de{' '}
                    <span className="gradient-text">notre collaboration</span>
                </h2>

                <div className={styles.grid}>
                    {testimonials.map((t, i) => (
                        <div 
                            key={i} 
                            className={styles.card}
                            ref={el => cardsRef.current[i] = el}
                        >
                            <div className={styles.quote}>"</div>
                            <p className={styles.content}>{t.content}</p>
                            
                            <div className={styles.footer}>
                                <div className={styles.avatar}>{t.avatar}</div>
                                <div className={styles.info}>
                                    <h4 className={styles.name}>{t.name}</h4>
                                    <p className={styles.role}>{t.role}</p>
                                </div>
                            </div>
                            
                            <div className={styles.stars}>
                                {[...Array(t.rating)].map((_, j) => (
                                    <span key={j} className={styles.star}>★</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
