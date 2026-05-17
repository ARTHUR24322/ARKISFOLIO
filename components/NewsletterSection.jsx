'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './NewsletterSection.module.css';

export default function NewsletterSection() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const sectionRef = useRef(null);

    useEffect(() => {
        (async () => {
            const { gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            gsap.fromTo(
                sectionRef.current,
                { opacity: 0, y: 50, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 85%',
                    }
                }
            );
        })();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');

        // TODO: Replace with your actual newsletter API integration (e.g., Resend, Mailchimp, ConvertKit)
        setTimeout(() => {
            if (email.includes('@')) {
                setStatus('success');
                setEmail('');
            } else {
                setStatus('error');
            }
        }, 1500);
    };

    return (
        <section id="newsletter" className={styles.section}>
            <div className="container">
                <div className={styles.card} ref={sectionRef}>
                    <div className={styles.glow} />
                    
                    <div className={styles.content}>
                        <div className={styles.iconWrapper}>
                            <span className={styles.icon}>📬</span>
                        </div>
                        
                        <h2 className={styles.heading}>
                            Restons en <span className="gradient-text">contact</span>
                        </h2>
                        
                        <p className={styles.description}>
                            Inscrivez-vous à ma newsletter pour recevoir mes dernières réflexions sur le développement, le design 3D et l'intelligence artificielle. Zéro spam, promis.
                        </p>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <input
                                    type="email"
                                    placeholder="votre@email.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (status === 'error') setStatus('idle');
                                    }}
                                    className={`${styles.input} ${status === 'error' ? styles.inputError : ''}`}
                                    disabled={status === 'loading' || status === 'success'}
                                    required
                                />
                                <button 
                                    type="submit" 
                                    className={`${styles.button} ${status === 'loading' ? styles.buttonLoading : ''} ${status === 'success' ? styles.buttonSuccess : ''}`}
                                    disabled={status === 'loading' || status === 'success'}
                                >
                                    {status === 'loading' ? (
                                        <span className={styles.spinner} />
                                    ) : status === 'success' ? (
                                        <span>✔ Inscrit</span>
                                    ) : (
                                        <span>S'inscrire</span>
                                    )}
                                </button>
                            </div>
                            
                            {status === 'error' && (
                                <p className={styles.errorText}>Veuillez entrer une adresse email valide.</p>
                            )}
                            {status === 'success' && (
                                <p className={styles.successText}>Merci ! Vous êtes bien inscrit à la newsletter.</p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
