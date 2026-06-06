'use client';
import { useState, useEffect } from 'react';
import styles from '../projects/projects.module.css'; // Reuse existing styles

export default function AdminApps() {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentApp, setCurrentApp] = useState({
        title: '', description: '', url: '', repo_url: '', status: 'Live', emoji: '🚀', tags: '', published: true
    });

    useEffect(() => {
        fetchApps();
    }, []);

    const fetchApps = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/web-apps?all=true');
            const data = await res.json();
            if (Array.isArray(data)) {
                setApps(data);
            } else {
                alert('Erreur lors du chargement');
            }
        } catch (err) {
            alert('Erreur serveur');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const method = currentApp.id ? 'PUT' : 'POST';

        const formData = new FormData();
        if (currentApp.id) formData.append('id', currentApp.id);
        formData.append('title', currentApp.title);
        formData.append('description', currentApp.description);
        formData.append('url', currentApp.url);
        formData.append('repo_url', currentApp.repo_url);
        formData.append('status', currentApp.status);
        formData.append('emoji', currentApp.emoji);
        formData.append('published', currentApp.published);

        const tags = typeof currentApp.tags === 'string'
            ? currentApp.tags.split(',').map(s => s.trim())
            : currentApp.tags;
        formData.append('tags', JSON.stringify(tags));

        if (currentApp.imageFile) {
            formData.append('image', currentApp.imageFile);
        }

        try {
            const res = await fetch('/api/web-apps', {
                method,
                body: formData,
            });

            if (res.ok) {
                setIsEditing(false);
                setCurrentApp({ title: '', description: '', url: '', repo_url: '', status: 'Live', emoji: '🚀', tags: '', published: true });
                fetchApps();
            } else {
                alert('Erreur lors de la sauvegarde');
            }
        } catch (err) {
            alert('Erreur serveur');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cette application ?')) return;

        try {
            const res = await fetch(`/api/web-apps?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchApps();
        } catch (err) {
            alert('Erreur serveur');
        }
    };

    const openEdit = (app) => {
        setCurrentApp({
            ...app,
            tags: Array.isArray(app.tags) ? app.tags.join(', ') : app.tags
        });
        setIsEditing(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Gestion des Apps Web</h1>
                <button
                    onClick={() => {
                        setIsEditing(true);
                        setCurrentApp({ title: '', description: '', url: '', repo_url: '', status: 'Live', emoji: '🚀', tags: '', published: true });
                    }}
                    className={styles.addBtn}
                >
                    + Nouvelle Application
                </button>
            </div>

            {isEditing && (
                <div className={styles.modal}>
                    <form className={styles.form} onSubmit={handleSave}>
                        <h2>{currentApp.id ? 'Modifier' : 'Ajouter'} une App</h2>

                        <div className={styles.row}>
                            <div className={styles.f}>
                                <label>Titre</label>
                                <input
                                    value={currentApp.title}
                                    onChange={e => setCurrentApp({ ...currentApp, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.f}>
                                <label>Statut</label>
                                <select
                                    value={currentApp.status}
                                    onChange={e => setCurrentApp({ ...currentApp, status: e.target.value })}
                                >
                                    <option value="Live">Live</option>
                                    <option value="Beta">Beta</option>
                                    <option value="En cours">En cours</option>
                                    <option value="Lab">Lab</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.f}>
                            <label>Description</label>
                            <textarea
                                value={currentApp.description}
                                onChange={e => setCurrentApp({ ...currentApp, description: e.target.value })}
                                rows="2"
                                required
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.f}>
                                <label>URL de l'App</label>
                                <input
                                    value={currentApp.url}
                                    onChange={e => setCurrentApp({ ...currentApp, url: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className={styles.f}>
                                <label>URL Repo (GitHub)</label>
                                <input
                                    value={currentApp.repo_url}
                                    onChange={e => setCurrentApp({ ...currentApp, repo_url: e.target.value })}
                                    placeholder="https://github.com/..."
                                />
                            </div>
                        </div>

                        <div className={styles.f}>
                            <label>Capture d'écran</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const previewUrl = URL.createObjectURL(file);
                                        setCurrentApp({ ...currentApp, imageFile: file, previewUrl });
                                    }
                                }}
                            />
                            {(currentApp.previewUrl || currentApp.image_url) && (
                                <img src={currentApp.previewUrl || currentApp.image_url} style={{ width: '100px', marginTop: '10px', borderRadius: '5px' }} alt="Preview" />
                            )}
                        </div>

                        <div className={styles.row}>
                            <div className={styles.f}>
                                <label>Tags (Next.js, AI, etc.)</label>
                                <input
                                    value={currentApp.tags}
                                    onChange={e => setCurrentApp({ ...currentApp, tags: e.target.value })}
                                />
                            </div>
                            <div className={styles.f}>
                                <label>Emoji</label>
                                <input
                                    value={currentApp.emoji}
                                    onChange={e => setCurrentApp({ ...currentApp, emoji: e.target.value })}
                                    maxLength="2"
                                />
                            </div>
                        </div>

                        <div className={styles.fCheckbox}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={currentApp.published}
                                    onChange={e => setCurrentApp({ ...currentApp, published: e.target.checked })}
                                />
                                Publié sur le site
                            </label>
                        </div>

                        <div className={styles.actions}>
                            <button type="button" onClick={() => setIsEditing(false)} className={styles.cancel}>Annuler</button>
                            <button type="submit" className={styles.save}>Sauvegarder</button>
                        </div>
                    </form>
                </div>
            )}

            <div className={styles.grid}>
                {loading ? (
                    <p>Chargement...</p>
                ) : apps.length > 0 ? (
                    apps.map(app => (
                        <div key={app.id} className={styles.projectCard}>
                            <div className={styles.pInfo}>
                                <span className={styles.pEmoji}>{app.emoji}</span>
                                <div>
                                    <h3>{app.title}</h3>
                                    <p>{app.status} — {app.url}</p>
                                </div>
                            </div>
                            <div className={styles.pActions}>
                                <button onClick={() => openEdit(app)}>Modifier</button>
                                <button onClick={() => handleDelete(app.id)} className={styles.delete}>Supprimer</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Aucune application enregistrée.</p>
                )}
            </div>
        </div>
    );
}
