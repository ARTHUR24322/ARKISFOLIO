'use client';
import { useState, useRef } from 'react';
import styles from '../page.module.css';
import { useRouter } from 'next/navigation';

export default function CVAdminPage() {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const router = useRouter();

    const currentCvUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cv/cv_arthur_kisumbule.pdf`;

    const handleFileChange = (selectedFile) => {
        if (!selectedFile) return;
        
        if (selectedFile.type !== 'application/pdf') {
            setError('Seuls les fichiers PDF sont acceptés.');
            setFile(null);
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            setError('Le fichier est trop volumineux (Max: 5MB).');
            setFile(null);
            return;
        }

        setFile(selectedFile);
        setError('');
        setMessage('');
    };

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files?.[0];
        handleFileChange(droppedFile);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Veuillez sélectionner un fichier PDF.');
            return;
        }

        setLoading(true);
        setMessage('');
        setError('');

        try {
            const formData = new FormData();
            formData.append('cv', file);

            const res = await fetch('/api/cv', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('CV mis à jour avec succès !');
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
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
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <h1 className={styles.title}>Gestion du CV</h1>
                <p className={styles.desc}>Gérez le document que les recruteurs et clients téléchargent sur votre portfolio.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
                <div className={styles.statCard} style={{ cursor: 'default' }}>
                    <h2 className={styles.sectionTitle} style={{ marginBottom: '24px' }}>Mettre à jour le fichier</h2>
                    
                    {message && (
                        <div style={{ padding: '12px 16px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                            {message}
                        </div>
                    )}
                    
                    {error && (
                        <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            {error}
                        </div>
                    )}

                    <div 
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            border: `2px dashed ${isDragging ? '#4F8EF7' : 'rgba(255,255,255,0.1)'}`,
                            background: isDragging ? 'rgba(79, 142, 247, 0.05)' : 'rgba(255,255,255,0.02)',
                            borderRadius: '16px',
                            padding: '48px 24px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            marginBottom: '24px'
                        }}
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={(e) => handleFileChange(e.target.files?.[0])}
                            hidden 
                            accept="application/pdf"
                        />
                        
                        <div style={{ fontSize: '40px', marginBottom: '16px' }}>📄</div>
                        {file ? (
                            <div>
                                <p style={{ color: 'white', fontWeight: '500' }}>{file.name}</p>
                                <p style={{ color: '#888', fontSize: '12px' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        ) : (
                            <div>
                                <p style={{ color: 'white', fontWeight: '500' }}>Glissez votre nouveau CV ici</p>
                                <p style={{ color: '#888', fontSize: '14px', marginTop: '4px' }}>ou cliquez pour parcourir vos fichiers</p>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className={styles.actionBtn}
                        style={{
                            width: '100%',
                            background: file && !loading ? '#4F8EF7' : '#222',
                            color: file && !loading ? 'white' : '#555',
                            border: 'none',
                            cursor: file && !loading ? 'pointer' : 'not-allowed',
                            padding: '16px',
                            fontWeight: '600'
                        }}
                    >
                        {loading ? 'Téléchargement...' : 'Publier le nouveau CV'}
                    </button>
                </div>

                <div className={styles.statCard} style={{ height: 'fit-content', borderLeft: '4px solid #4F8EF7' }}>
                    <h2 className={styles.sectionTitle} style={{ fontSize: '16px', marginBottom: '16px' }}>État du CV</h2>
                    <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>
                        Le fichier est hébergé sur Supabase et mis à jour instantanément sur le site.
                    </p>
                    
                    <a 
                        href={currentCvUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            color: 'white',
                            fontSize: '14px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span style={{ fontSize: '20px' }}>👁️</span>
                        <span>Voir le CV actuel</span>
                    </a>
                </div>
            </div>
        </div>
    );
}

