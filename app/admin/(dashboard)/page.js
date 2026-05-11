'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ projects: 0, products: 0, messages: 0 });
    const [analytics, setAnalytics] = useState({ visits: 0, clicks: 0, revenue: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [pRes, prRes, mRes, aRes] = await Promise.all([
                    fetch('/api/projects?all=true'),
                    fetch('/api/products?all=true'),
                    fetch('/api/messages'),
                    fetch('/api/analytics')
                ]);

                const projects = await pRes.json();
                const products = await prRes.json();
                const messages = await mRes.json();
                const analyticsData = await aRes.json();

                setStats({
                    projects: Array.isArray(projects) ? projects.length : 0,
                    products: Array.isArray(products) ? products.length : 0,
                    messages: Array.isArray(messages) ? messages.filter(m => !m.read).length : 0
                });
                setAnalytics(analyticsData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <h1 className={styles.title}>Dashboard Arthur</h1>
                <p className={styles.desc}>Gérez vos réalisations, vos produits et vos messages.</p>
            </header>

            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Projets publiés</span>
                    <span className={styles.statValue}>{loading ? '...' : stats.projects}</span>
                    <div className={styles.statIcon}>🚀</div>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Produits boutique</span>
                    <span className={styles.statValue}>{loading ? '...' : stats.products}</span>
                    <div className={styles.statIcon}>🛍️</div>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Messages non lus</span>
                    <span className={styles.statValue} style={{ color: stats.messages > 0 ? '#4F8EF7' : 'inherit' }}>
                        {loading ? '...' : stats.messages}
                    </span>
                    <div className={styles.statIcon}>✉</div>
                </div>
            </div>

            <div className={styles.stats} style={{ marginTop: '24px' }}>
                <div className={`${styles.statCard} ${styles.statAnalytics}`}>
                    <span className={styles.statLabel}>Vues totales</span>
                    <span className={styles.statValue}>{loading ? '...' : analytics.visits}</span>
                    <div className={styles.statIcon}>👁️</div>
                </div>
                <div className={`${styles.statCard} ${styles.statAnalytics}`}>
                    <span className={styles.statLabel}>Clics achat</span>
                    <span className={styles.statValue}>{loading ? '...' : analytics.clicks}</span>
                    <div className={styles.statIcon}>🖱️</div>
                </div>
                <div className={`${styles.statCard} ${styles.statRevenue}`}>
                    <span className={styles.statLabel}>Revenu Global</span>
                    <span className={styles.statValue} style={{ color: '#22c55e' }}>{loading ? '...' : analytics.revenue}$</span>
                    <div className={styles.statIcon}>💰</div>
                </div>
            </div>

            <section className={styles.quickActions}>
                <h2 className={styles.sectionTitle}>Actions rapides</h2>
                <div className={styles.actionGrid}>
                    <a href="/admin/projects" className={styles.actionBtn}>
                        <span className={styles.actionIcon}>➕</span>
                        <span>Nouveau Projet</span>
                    </a>
                    <a href="/admin/messages" className={styles.actionBtn}>
                        <span className={styles.actionIcon}>✉</span>
                        <span>Voir les Messages</span>
                    </a>
                    <a href="/" className={styles.actionBtn}>
                        <span className={styles.actionIcon}>👁️</span>
                        <span>Voir le Portfolio</span>
                    </a>
                </div>
            </section>
        </div>
    );
}
