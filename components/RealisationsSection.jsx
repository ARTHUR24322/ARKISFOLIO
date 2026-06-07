'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './RealisationsSection.module.css';

const categories = ['Tous', 'Web', '3D', 'IA'];

export default function RealisationsSection() {
    const [realisations, setRealisations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState('Tous');
    const [hovered, setHovered] = useState(null);
    const sectionRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        fetch('/api/projects')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const formattedData = data.map(item => ({
                        ...item,
                        mediaUrl: item.media_url || item.mediaUrl,
                        liveUrl: item.live_url || item.liveUrl || '#'
                    }));
                    setRealisations(formattedData);
                } else {
                    console.error('Data is not an array:', data);
                    setRealisations([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
                setRealisations([]);
            });
    }, []);

    const filtered = active === 'Tous' ? realisations : realisations.filter((r) => r.category === active);

    useEffect(() => {
        (async () => {
            const { gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            gsap.fromTo(
                '.real-title',
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0, duration: 1,
                    scrollTrigger: { trigger: '#realisations', start: 'top 80%' }
                }
            );
            gsap.fromTo(
                '.real-subtitle',
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0, duration: 0.8, delay: 0.2,
                    scrollTrigger: { trigger: '#realisations', start: 'top 80%' }
                }
            );
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const { gsap } = await import('gsap');
            gsap.fromTo(
                cardsRef.current.filter(Boolean),
                { opacity: 0, y: 40, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
            );
        })();
    }, [active]);

    return (
        <section id="realisations" className={styles.section} ref={sectionRef}>
            {/* Background glow */}
            <div className={styles.bgGlow} />

            <div className="container">
                <p className="section-label">Réalisations</p>
                <h2 className={`${styles.heading} real-title`}>
                    Mes projets &{' '}
                    <span className="gradient-text">créations récentes</span>
                </h2>
                <p className={`${styles.subtitle} real-subtitle`}>
                    Chaque projet est une solution sur-mesure. Découvrez mes dernières réalisations.
                </p>

                {/* Filter tabs */}
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

                {/* Masonry grid */}
                <div className={styles.grid}>
                    {filtered.map((item, i) => (
                        <div
                            key={item.id}
                            ref={(el) => (cardsRef.current[i] = el)}
                            className={`${styles.card} ${i % 3 === 0 ? styles.cardWide : ''}`}
                            style={{ '--accent': item.accent }}
                            onMouseEnter={() => setHovered(item.id)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            {/* Card image / preview */}
                            <div className={styles.cardVisual} style={{ background: item.gradient }}>
                                {item.mediaUrl ? (
                                    <>
                                        {item.mediaUrl.match(/\.(mp4|webm|mov)$/i) ? (
                                            <video
                                                src={item.mediaUrl}
                                                className={styles.media}
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                            />
                                        ) : (
                                            <div className={styles.imageWrap}>
                                                <Image 
                                                    src={item.mediaUrl} 
                                                    alt={item.title} 
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                    className={styles.media} 
                                                />
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <span className={styles.cardEmoji}>{item.emoji}</span>
                                )}
                                <div className={`${styles.cardOverlay} ${hovered === item.id ? styles.cardOverlayVisible : ''}`}>
                                    <a href={item.liveUrl} className={styles.liveBtn} target="_blank" rel="noopener noreferrer">
                                        Voir en live
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </a>
                                </div>
                                <span className={styles.yearBadge}>{item.year}</span>
                            </div>

                            {/* Card body */}
                            <div className={styles.cardBody}>
                                <div className={styles.cardMeta}>
                                    <span className={styles.catBadge}>{item.category}</span>
                                    <span className={styles.cardYear}>{item.year}</span>
                                </div>
                                <h3 className={styles.cardTitle}>{item.title}</h3>
                                <p className={styles.cardDesc}>{item.description}</p>
                                <div className={styles.tags}>
                                    {item.tags.map((t) => (
                                        <span key={t} className={styles.tag}>{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA to post a project */}
                <div className={styles.postCta}>
                    <div className={styles.postCtaInner}>
                        <span className={styles.postCtaIcon}>✦</span>
                        <div>
                            <p className={styles.postCtaTitle}>Vous avez un projet à réaliser ?</p>
                            <p className={styles.postCtaDesc}>Discutons de votre vision et transformons-la en réalité.</p>
                        </div>
                        <a href="#contact" className={styles.postCtaBtn}>
                            Démarrer un projet
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
