'use client';
import { useState, useRef } from 'react';
import styles from '../page.module.css'; // We can reuse standard dashboard styles
import { useRouter } from 'next/navigation';

export default function CVAdminPage() {
    const [file, setFile] = null;
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const router = useRouter();

    const handleUpload = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const selectedFile = fileInputRef.current?.files?.[0];
        if (!selectedFile) {
            setError('Veuillez sélectionner un fichier PDF.');
            return;
        }

        if (selectedFile.type !== 'application/pdf') {
            setError('Seuls les fichiers PDF sont acceptés.');
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            setError('Le fichier est trop volumineux (Max: 5MB).');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('cv', selectedFile);

            const res = await fetch('/api/cv', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                if (fileInputRef.current) fileInputRef.current.value = '';
                // Rafraichir le cache route
                router.refresh();
            } else {
                setError(data.error || 'Erreur lors du transfert.');
            }
        } catch (err) {
            console.error(err);
            setError('Impossible de se connecter au serveur.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Gestion du CV</h1>
                    <p className={styles.subtitle}>Mettez à jour le PDF que vos visiteurs peuvent télécharger.</p>
                </div>
            </div>

            <div className={styles.card} style={{ maxWidth: '600px' }}>
                <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Uploader un nouveau CV</h2>
                
                {message && <div className={styles.successMessage} style={{ marginBottom: '20px', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px' }}>{message}</div>}
                {error && <div className={styles.errorMessage} style={{ marginBottom: '20px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px' }}>{error}</div>}

                <form onSubmit={handleUpload}>
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            Fichier PDF (Max: 5 Mo)
                        </label>
                        <input
                            type="file"
                            accept="application/pdf"
                            ref={fileInputRef}
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '12px',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid var(--border)',
                                borderRadius: '10px',
                                color: 'var(--text-primary)',
                                cursor: 'pointer'
                            }}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            padding: '12px 24px',
                            background: 'var(--accent-blue)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                    >
                        {loading ? 'Téléchargement...' : 'Sauvegarder le CV'}
                    </button>
                    
                    <p style={{ marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        Note : Une fois sauvegardé, le nouveau CV remplacera automatiquement le précédent sur le site public.
                    </p>
                </form>
            </div>
        </div>
    );
}
