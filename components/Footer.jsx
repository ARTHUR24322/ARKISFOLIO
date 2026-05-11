'use client';
import styles from './Footer.module.css';

export default function Footer() {
    const handleLink = (e, href) => {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.line} />
            <div className="container">
                <div className={styles.inner}>
                    <div className={styles.brand}>
                        <div className={styles.logoMark}>AK</div>
                        <div>
                            <p className={styles.name}>Arthur Kisumbule</p>
                            <p className={styles.tagline}>Développeur créatif • Designer 3D • Créateur d'agents IA</p>
                        </div>
                    </div>

                    <nav className={styles.nav}>
                        {[
                            { href: '#services', label: 'Services' },
                            { href: '#realisations', label: 'Projets' },
                            { href: '#shop', label: 'Boutique' },
                            { href: '#solutions', label: 'Solutions' },
                            { href: '#skills', label: 'Compétences' },
                            { href: '#contact', label: 'Contact' }
                        ].map((link) => (
                            <a key={link.href} href={link.href} onClick={(e) => handleLink(e, link.href)} className={styles.link}>
                                {link.label}
                            </a>
                        ))}
                    </nav>
                </div>

                <div className={styles.bottom}>
                    <p className={styles.copy}>© 2024 Arthur Kisumbule. Tous droits réservés.</p>
                    <p className={styles.copy}>Conçu & développé avec ✦ par Arthur Kisumbule</p>
                </div>
            </div>
        </footer>
    );
}
