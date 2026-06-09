'use client';
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import styles from './HeroSection.module.css';

const ThreeScene = dynamic(() => import('./ThreeScene'), { ssr: false });

const socials = [
    { name: 'Instagram', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>, url: 'https://www.instagram.com/arthu_rkisumbule' },
    { name: 'Email', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>, url: 'mailto:kisumbulearthur@gmail.com' },
    { name: 'WhatsApp', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3l-1.9 4.9L21 11.5z"></path></svg>, url: 'https://wa.me/243834590319' },
    { name: 'GitHub', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>, url: 'https://github.com/ARTHUR24322' },
    { name: 'Facebook', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>, url: 'https://www.facebook.com/profile.php?id=61581598606891' },
    { name: 'TikTok', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>, url: 'https://www.tiktok.com/@arthurarkis' },
    { name: 'YouTube', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>, url: 'https://www.youtube.com/@ArthurKisumbule' },
    { name: 'Reddit', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0z"></path></svg>, url: 'https://www.reddit.com/user/Salt-Competition3377' },
    { name: 'LinkedIn', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>, url: 'https://www.linkedin.com/in/arthur-kisumbule-1b5416301' },
    { name: 'Discord', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 9h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>, url: 'https://discord.gg/EykUhWpXH' },
    { name: 'Twitch', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"></path></svg>, url: 'https://www.twitch.tv/arthur2_243' },
    { name: 'Snapchat', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C10.8954 2 10 2.89543 10 4C10 5.10457 10.8954 6 12 6C13.1046 6 14 5.10457 14 4C14 2.89543 13.1046 2 12 2Z" fill="currentColor"/><path d="M12 6C8.5 6 6.5 8.5 6.5 11C6.5 11.5 6.5 12 7 12.5C5.5 13 4 14.5 4 16.5C4 18 5.5 19 7 19H17C18.5 19 20 18 20 16.5C20 14.5 18.5 13 17 12.5C17.5 12 17.5 11.5 17.5 11C17.5 8.5 15.5 6 12 6Z" fill="currentColor"/></svg>, url: 'https://www.snapchat.com/add/arkisking232' },
];

export default function HeroSection() {
    const headingRef = useRef(null);
    const subtitleRef = useRef(null);
    const descRef = useRef(null);
    const ctaRef = useRef(null);
    const scrollRef = useRef(null);
    const botRef = useRef(null);

    useEffect(() => {
        let cleanup;
        (async () => {
            const { gsap } = await import('gsap');
            
            // Mouse follower bot with scaling
            const moveBot = (e) => {
                const target = e.target;
                const isLink = target.closest('a') || target.closest('button');
                
                gsap.to(botRef.current, {
                    x: e.clientX,
                    y: e.clientY,
                    scale: isLink ? 2.5 : 1,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            };
            window.addEventListener('mousemove', moveBot);

            const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
            tl.fromTo(headingRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.2, delay: 0.3 })
                .fromTo(subtitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
                .fromTo(descRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
                .fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4');

            cleanup = () => window.removeEventListener('mousemove', moveBot);
        })();
        return () => cleanup && cleanup();
    }, []);


    const handleScroll = (e, href) => {
        if (href.startsWith('#')) {
            e.preventDefault();
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="home" className={styles.hero}>
            <div ref={botRef} className={styles.cursorBot}>
                <div className={styles.botEye} />
            </div>

            <div className={styles.canvasWrap}>
                <ThreeScene />
            </div>

            <div className={styles.content}>
                {/* Left Column */}
                <div className={styles.leftContent}>
                    <div className={styles.badge}>
                        <span className={styles.badgeDot} />
                        Disponible pour de nouveaux projets
                    </div>

                    <h1 ref={headingRef} className={styles.heading}>
                        Salut, je suis <span className={styles.nameHighlight}>Arthur</span><br />
                        Développeur Full-Stack
                    </h1>

                    <p ref={descRef} className={styles.description}>
                        Je crée des applications web & mobiles modernes qui font briller votre business. 
                        Des solutions sur mesure, professionnelles et performantes.
                    </p>

                    <div ref={ctaRef} className={styles.ctas}>
                        <a href="https://github.com/ARTHUR24322" target="_blank" rel="noopener noreferrer" className={styles.ctaGitHub}>
                            <div className={styles.ctaGlow} />
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" className={styles.gitIcon}><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                            <span>Explorer mon GitHub</span>
                        </a>
                        <a 
                            href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cv/cv_arthur_kisumbule.pdf`} 
                            target="_blank" 
                            className={styles.ctaSecondary}
                            onClick={() => {
                                fetch('/api/analytics', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ type: 'cv_download' }),
                                }).catch(() => {});
                            }}
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            Voir mon CV
                        </a>
                    </div>

                    <div ref={subtitleRef} className={styles.statsGrid}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>10+</span>
                            <span className={styles.statLabel}>Projets réalisés</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>100%</span>
                            <span className={styles.statLabel}>Clients satisfaits</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>3+</span>
                            <span className={styles.statLabel}>Ans d'expérience</span>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className={styles.rightContent}>
                    <div className={styles.visualContainer}>
                        <div className={styles.profileRing}>
                            <div className={styles.profilePicWrap}>
                                <Image 
                                    src="/profile.png" 
                                    alt="Arthur Kisumbule" 
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                        
                        <div className={styles.socialOrbit}>
                            {socials.slice(0, 8).map((social, i) => (
                                <a 
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.socialIcon}
                                    style={{ '--index': i }}
                                    title={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
