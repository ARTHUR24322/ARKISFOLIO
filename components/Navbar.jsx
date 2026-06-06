'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './Navbar.module.css';

const navLinks = [
    { href: '#services', label: 'Services' },
    { href: '#realisations', label: 'Projets' },
    { href: '#shop', label: 'Boutique' },
    { href: '#solutions', label: 'Solutions' },
    { href: '#process', label: 'Process' },
    { href: '#skills', label: 'Compétences' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLink = (e, href) => {
        e.preventDefault();
        setMenuOpen(false);
        if (href === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        try {
            const el = document.querySelector(href);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        } catch (err) {
            console.error('Invalid selector:', href);
        }
    };

    return (
        <nav ref={navRef} className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} role="navigation" aria-label="Main Navigation">
            <div className={styles.inner}>
                <a href="#" className={styles.logo} onClick={(e) => handleLink(e, '#')} aria-label="Arthur Kisumbule - Accueil">
                    <Image src="/logo.png" alt="Logo ARKIS" width={32} height={32} className={styles.logoImage} aria-hidden="true" />
                    <span className={styles.logoText}>ARKIS</span>
                </a>

                <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
                    <div className={styles.menuHeader}>
                        <span className={styles.menuLabel}>Navigation</span>
                        <div className={styles.menuLine} />
                    </div>
                    {navLinks.map((link, index) => (
                        <li key={link.href} style={{ '--index': index }}>
                            <a href={link.href} onClick={(e) => handleLink(e, link.href)} className={styles.link}>
                                <span className={styles.linkNumber}>0{index + 1}.</span>
                                <span className={styles.linkLabel}>{link.label}</span>
                            </a>
                        </li>
                    ))}
                    <li style={{ '--index': navLinks.length }}>
                        <a href="#contact" onClick={(e) => handleLink(e, '#contact')} className={styles.cta}>
                            Contact
                        </a>
                    </li>
                    <div className={styles.menuFooter}>
                        <div className={styles.socials}>
                            <a href="https://linkedin.com/in/arthur-kisumbule-1b5416301" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>LN</a>
                            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>GH</a>
                            <a href="https://youtube.com/@yourchannel" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>YT</a>
                            <a href="https://tiktok.com/@yourusername" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>TK</a>
                            <a href="https://facebook.com/yourprofile" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>FB</a>
                        </div>
                        <p className={styles.legal}>© 2026 ARKIS STUDIO</p>
                    </div>
                </ul>


                <button 
                    className={styles.burger} 
                    onClick={() => setMenuOpen(!menuOpen)} 
                    aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                    aria-expanded={menuOpen}
                >
                    <span className={menuOpen ? styles.burgerLineOpen : styles.burgerLine} />
                    <span className={menuOpen ? styles.burgerLineOpen2 : styles.burgerLine} />
                    <span className={menuOpen ? styles.burgerLineOpen3 : styles.burgerLine} />
                </button>
            </div>
        </nav>
    );
}
