'use client';
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import styles from './HeroSection.module.css';

const ThreeScene = dynamic(() => import('./ThreeScene'), { ssr: false });

export default function HeroSection() {
    const headingRef = useRef(null);
    const subtitleRef = useRef(null);
    const descRef = useRef(null);
    const ctaRef = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        let cleanup;
        (async () => {
            const { gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.fromTo(headingRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, delay: 0.3 })
                .fromTo(subtitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
                .fromTo(descRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
                .fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
                .fromTo(scrollRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.2');

            const handleMouseMove = (e) => {
                const { clientX, clientY } = e;
                const xPos = (clientX / window.innerWidth - 0.5) * 20;
                const yPos = (clientY / window.innerHeight - 0.5) * 20;
                gsap.to(headingRef.current, { x: xPos * 0.4, y: yPos * 0.4, duration: 1, ease: 'power2.out' });
                gsap.to(subtitleRef.current, { x: xPos * 0.2, y: yPos * 0.2, duration: 1, ease: 'power2.out' });
            };

            window.addEventListener('mousemove', handleMouseMove);
            cleanup = () => window.removeEventListener('mousemove', handleMouseMove);
        })();
        return () => cleanup && cleanup();
    }, []);


    const handleScroll = (e, href) => {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="home" className={styles.hero}>
            {/* 3D Background */}
            <div className={styles.canvasWrap}>
                <ThreeScene />
            </div>

            {/* Radial glow */}
            <div className={styles.glow} />

            {/* Grid lines */}
            <div className={styles.grid} />

            {/* Content */}
            <div className={styles.content}>
                <div className={styles.badge}>
                    <span className={styles.badgeDot} />
                    Disponible pour de nouveaux projets
                </div>

                <h1 ref={headingRef} className={styles.heading}>
                    Arthur<br />
                    <span className="gradient-text">Kisumbule</span>
                </h1>

                <div ref={subtitleRef} className={styles.tags}>
                    <span className={styles.tag}>💻 Développeur créatif</span>
                    <span className={styles.tagSep}>•</span>
                    <span className={styles.tag}>🧊 Designer 3D</span>
                    <span className={styles.tagSep}>•</span>
                    <span className={styles.tag}>🤖 Créateur d'agents IA</span>
                </div>

                <p ref={descRef} className={styles.description}>
                    Je conçois des expériences digitales immersives et des systèmes intelligents qui{' '}
                    <span className={styles.highlight}>transforment les entreprises.</span>
                </p>

                <div ref={ctaRef} className={styles.ctas}>
                    <a href="#projects" onClick={(e) => handleScroll(e, '#projects')} className={styles.ctaPrimary}>
                        <span>Voir mes projets</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                    <a href="#contact" onClick={(e) => handleScroll(e, '#contact')} className={styles.ctaSecondary}>
                        Discuter d'un projet
                    </a>
                </div>
            </div>

            {/* Scroll indicator */}
            <div ref={scrollRef} className={styles.scroll}>
                <div className={styles.scrollLine} />
                <span className={styles.scrollLabel}>Scroll</span>
            </div>
        </section>
    );
}
