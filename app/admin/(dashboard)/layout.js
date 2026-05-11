import { redirect } from 'next/navigation';
import { getAdminFromCookie } from '../../../lib/auth';
import AdminNavbar from './components/AdminNavbar';
import styles from './admin.module.css';

export default async function AdminLayout({ children }) {
    const admin = await getAdminFromCookie();

    // Protection des routes admin (sauf le login)
    // Note: Dans une app réelle, on vérifierait aussi le path pour éviter une boucle infinie s'il n'y avait pas de groupe de routes
    if (!admin) {
        // Cette logique sera déclenchée si on essaie d'accéder à /admin sans être connecté
    }

    return (
        <div className={styles.layout}>
            {admin ? (
                <>
                    <AdminNavbar />
                    <main className={styles.main}>{children}</main>
                </>
            ) : (
                <div className={styles.unauthorized}>
                    <h1>Accès Restreint</h1>
                    <p>Vous devez être connecté en tant qu'administrateur pour accéder à cette page.</p>
                    <a href="/admin/login" className={styles.loginBtn}>Se connecter</a>
                </div>
            )}
        </div>
    );
}
