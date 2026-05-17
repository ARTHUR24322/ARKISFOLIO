'use client';
import { useEffect, useRef } from 'react';
import styles from './ContactSection.module.css';

export default function ContactSection() {
    const sectionRef = useRef(null);

    useEffect(() => {
        (async () => {
            const { gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            gsap.fromTo(
                sectionRef.current,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
            );
        })();
    }, []);

    return (
        <section id="contact" className={styles.section}>
            <div className={styles.bg} />
            <div className="container">
                <div ref={sectionRef} className={styles.inner} style={{ opacity: 0 }}>
                    <p className="section-label">Contact</p>
                    <h2 className={styles.heading}>
                        Construisons quelque chose
                        <br />
                        <span className="gradient-text">d'intelligent ensemble.</span>
                    </h2>
                    <p className={styles.subtitle}>
                        Vous avez un projet ? Une idée ? Une problématique à résoudre ?<br />
                        Je réponds en moins de 24h.
                    </p>

                    <div className={styles.cards}>
                        <a href="mailto:kisumbulearthur@gmail.com" className={styles.card}>
                            <div className={styles.cardIcon}>✉️</div>
                            <div className={styles.cardBody}>
                                <span className={styles.cardLabel}>Email</span>
                                <span className={styles.cardValue}>kisumbulearthur@gmail.com</span>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </a>

                        <a
                            href="https://www.linkedin.com/in/arthur-kisumbule-1b5416301"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.card}
                        >
                            <div className={styles.cardIcon}>💼</div>
                            <div className={styles.cardBody}>
                                <span className={styles.cardLabel}>LinkedIn</span>
                                <span className={styles.cardValue}>arthur-kisumbule</span>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </a>

                        <a
                            href="https://github.com/yourusername"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.card}
                        >
                            <div className={styles.cardIcon}>🚀</div>
                            <div className={styles.cardBody}>
                                <span className={styles.cardLabel}>GitHub</span>
                                <span className={styles.cardValue}>@votre-pseudo</span>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </a>

                        <a
                            href="https://youtube.com/@yourchannel"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.card}
                        >
                            <div className={styles.cardIcon}>🎬</div>
                            <div className={styles.cardBody}>
                                <span className={styles.cardLabel}>YouTube</span>
                                <span className={styles.cardValue}>@votre-chaine</span>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </a>

                        <a
                            href="https://tiktok.com/@yourusername"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.card}
                        >
                            <div className={styles.cardIcon}>📱</div>
                            <div className={styles.cardBody}>
                                <span className={styles.cardLabel}>TikTok</span>
                                <span className={styles.cardValue}>@votre-pseudo</span>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </a>

                        <a
                            href="https://facebook.com/yourprofile"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.card}
                        >
                            <div className={styles.cardIcon}>👥</div>
                            <div className={styles.cardBody}>
                                <span className={styles.cardLabel}>Facebook</span>
                                <span className={styles.cardValue}>votre-nom</span>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </a>
                    </div>

                    <div className={styles.ctas}>
                        <a href="mailto:kisumbulearthur@gmail.com" className={styles.ctaPrimary}>
                            <span>Démarrer un projet</span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                        <a
                            href="https://calendly.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.ctaSecondary}
                        >
                            📅 Prendre rendez-vous
                        </a>
                    </div>

                    <p className={styles.note}>⚡ Réponse garantie sous 24h • Appel découverte gratuit (30 min)</p>
                </div>
            </div>
        </section>
    );
}
