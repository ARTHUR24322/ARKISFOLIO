'use client';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import styles from './AppsSection.module.css';

export default function AppsSection() {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    useEffect(() => {
        fetch('/api/web-apps')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setApps(data);
                } else {
                    console.error('Data is not an array:', data);
                    setApps([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setApps([]);
                setLoading(false);
            });
    }, []);

    if (!loading && apps.length === 0) return null;

    return (
        <section id="applications" className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <p className="section-label">Laboratoire Web</p>
                        <h2 className={styles.title}>
                            Découvrez mes <span className="gradient-text">applications interactives</span>
                        </h2>
                    </div>
                </div>

                <div className={styles.grid}>
                    {loading ? (
                        <p>Initialisation du laboratoire...</p>
                    ) : (
                        apps.map((app, i) => (
                            <div 
                                key={app.id} 
                                className={styles.card}
                                style={{ '--accent': app.accent }}
                            >
                                <div className={styles.visual} style={{ background: app.gradient }}>
                                    {app.image_url ? (
                                        <div className={styles.imgWrap}>
                                            <Image 
                                                src={app.image_url} 
                                                alt={app.title} 
                                                fill 
                                                className={styles.image}
                                            />
                                        </div>
                                    ) : (
                                        <span className={styles.emoji}>{app.emoji}</span>
                                    )}
                                    <div className={styles.statusBadge}>{app.status}</div>
                                </div>

                                <div className={styles.body}>
                                    <h3 className={styles.appTitle}>{app.title}</h3>
                                    <p className={styles.appDesc}>{app.description}</p>
                                    
                                    <div className={styles.tags}>
                                        {app.tags?.map(tag => (
                                            <span key={tag} className={styles.tag}>{tag}</span>
                                        ))}
                                    </div>

                                    <div className={styles.actions}>
                                        <a href={app.url} target="_blank" rel="noopener noreferrer" className={styles.launchBtn}>
                                            Lancer l'App
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </a>
                                        {app.repo_url && (
                                            <a href={app.repo_url} target="_blank" rel="noopener noreferrer" className={styles.codeLink}>
                                                GitHub
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
