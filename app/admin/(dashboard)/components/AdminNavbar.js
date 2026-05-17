'use client';
import { usePathname, useRouter } from 'next/navigation';
import styles from './AdminNavbar.module.css';

const links = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/projects', label: 'Projets' },
    { href: '/admin/shop', label: 'Boutique' },
    { href: '/admin/messages', label: 'Messages' },
    { href: '/admin/cv', label: 'Gestion CV' },
];

export default function AdminNavbar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth', { method: 'DELETE' });
        router.push('/');
        router.refresh();
    };

    return (
        <nav className={styles.nav}>
            <div className={styles.inner}>
                <div className={styles.brand}>
                    <div className={styles.logo}>AK</div>
                    <span>Admin Panel</span>
                </div>

                <ul className={styles.links}>
                    {links.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                className={`${styles.link} ${pathname === link.href ? styles.active : ''}`}
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className={styles.actions}>
                    <a href="/" className={styles.siteBtn}>Voir le site</a>
                    <button onClick={handleLogout} className={styles.logoutBtn}>Déconnexion</button>
                </div>
            </div>
        </nav>
    );
}
