'use client';
import { useState, useEffect } from 'react';
import styles from './projects.module.css';

export default function AdminProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState({
        title: '', category: 'Web', description: '', tags: '', emoji: '🚀', year: '2025', published: true
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/projects?all=true');
            const data = await res.json();
            if (Array.isArray(data)) {
                setProjects(data);
            } else {
                console.error('API Error:', data);
                alert(data.error || 'Erreur lors du chargement des projets');
            }
        } catch (err) {
            alert('Erreur lors du chargement des projets');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const method = currentProject.id ? 'PUT' : 'POST';

        const formData = new FormData();
        if (currentProject.id) formData.append('id', currentProject.id);
        formData.append('title', currentProject.title);
        formData.append('category', currentProject.category);
        formData.append('description', currentProject.description);
        formData.append('emoji', currentProject.emoji);
        formData.append('year', currentProject.year);
        formData.append('liveUrl', currentProject.liveUrl || '#');
        formData.append('published', currentProject.published);

        const tags = typeof currentProject.tags === 'string'
            ? currentProject.tags.split(',').map(s => s.trim())
            : currentProject.tags;
        formData.append('tags', JSON.stringify(tags));

        if (currentProject.mediaFile) {
            formData.append('media', currentProject.mediaFile);
        }

        try {
            const res = await fetch('/api/projects', {
                method,
                body: formData, // FormData automatically sets content-type to multipart/form-data
            });

            if (res.ok) {
                setIsEditing(false);
                setCurrentProject({ title: '', category: 'Web', description: '', tags: '', emoji: '🚀', year: '2025', published: true });
                fetchProjects();
            } else {
                alert('Erreur lors de la sauvegarde');
            }
        } catch (err) {
            alert('Erreur serveur');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Voulez-vous vraiment supprimer ce projet ?')) return;

        try {
            const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchProjects();
            else alert('Erreur lors de la suppression');
        } catch (err) {
            alert('Erreur serveur');
        }
    };

    const openEdit = (project) => {
        setCurrentProject({
            ...project,
            tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags
        });
        setIsEditing(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Gestion des Projets</h1>
                <button
                    onClick={() => {
                        setIsEditing(true);
                        setCurrentProject({ title: '', category: 'Web', description: '', tags: '', emoji: '🚀', year: '2025', published: true });
                    }}
                    className={styles.addBtn}
                >
                    + Nouveau Projet
                </button>
            </div>

            {isEditing && (
                <div className={styles.modal}>
                    <form className={styles.form} onSubmit={handleSave}>
                        <h2>{currentProject.id ? 'Modifier' : 'Ajouter'} un projet</h2>

                        <div className={styles.row}>
                            <div className={styles.f}>
                                <label>Titre</label>
                                <input
                                    value={currentProject.title}
                                    onChange={e => setCurrentProject({ ...currentProject, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.f}>
                                <label>Catégorie</label>
                                <select
                                    value={currentProject.category}
                                    onChange={e => setCurrentProject({ ...currentProject, category: e.target.value })}
                                >
                                    <option value="Web">Web</option>
                                    <option value="3D">3D</option>
                                    <option value="IA">IA</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.f}>
                            <label>Description</label>
                            <textarea
                                value={currentProject.description}
                                onChange={e => setCurrentProject({ ...currentProject, description: e.target.value })}
                                rows="3"
                                required
                            />
                        </div>

                        <div className={styles.f}>
                            <label>Média (Image ou Vidéo)</label>
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={e => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const previewUrl = URL.createObjectURL(file);
                                        setCurrentProject({ ...currentProject, mediaFile: file, previewUrl });
                                    }
                                }}
                            />
                            {/* Preview of local selection or existing media */}
                            {(currentProject.previewUrl || currentProject.mediaUrl) && (
                                <div className={styles.previewContainer}>
                                    <p className={styles.previewLabel}>Prévisualisation :</p>
                                    {(currentProject.previewUrl || currentProject.mediaUrl).match(/\.(mp4|webm|mov)$/i) || (currentProject.mediaFile && currentProject.mediaFile.type.startsWith('video/')) ? (
                                        <video src={currentProject.previewUrl || currentProject.mediaUrl} className={styles.smallPreview} controls muted />
                                    ) : (
                                        <img src={currentProject.previewUrl || currentProject.mediaUrl} className={styles.smallPreview} alt="Preview" />
                                    )}
                                </div>
                            )}
                        </div>

                        <div className={styles.row}>
                            <div className={styles.f}>
                                <label>Tags (séparés par virgule)</label>
                                <input
                                    value={currentProject.tags}
                                    onChange={e => setCurrentProject({ ...currentProject, tags: e.target.value })}
                                    placeholder="Next.js, GSAP, API"
                                />
                            </div>
                            <div className={styles.f}>
                                <label>Emoji</label>
                                <input
                                    value={currentProject.emoji}
                                    onChange={e => setCurrentProject({ ...currentProject, emoji: e.target.value })}
                                    maxLength="2"
                                />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.f}>
                                <label>Année</label>
                                <input
                                    value={currentProject.year}
                                    onChange={e => setCurrentProject({ ...currentProject, year: e.target.value })}
                                />
                            </div>
                            <div className={styles.f}>
                                <label>Lien Live</label>
                                <input
                                    value={currentProject.liveUrl || ''}
                                    onChange={e => setCurrentProject({ ...currentProject, liveUrl: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className={styles.fCheckbox}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={currentProject.published}
                                        onChange={e => setCurrentProject({ ...currentProject, published: e.target.checked })}
                                    />
                                    Publié
                                </label>
                            </div>
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
                ) : Array.isArray(projects) && projects.length > 0 ? (
                    projects.map(p => (
                        <div key={p.id} className={styles.projectCard}>
                            <div className={styles.pInfo}>
                                <span className={styles.pEmoji}>{p.emoji}</span>
                                <div>
                                    <h3>{p.title}</h3>
                                    <p>{p.category} — {p.year}</p>
                                </div>
                            </div>
                            <div className={styles.pStatus}>
                                <span className={p.published ? styles.badgeActive : styles.badgeDraft}>
                                    {p.published ? 'Publié' : 'Brouillon'}
                                </span>
                            </div>
                            <div className={styles.pActions}>
                                <button onClick={() => openEdit(p)}>Modifier</button>
                                <button onClick={() => handleDelete(p.id)} className={styles.delete}>Supprimer</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>{loading ? '' : projects.length === 0 ? 'Aucun projet trouvé.' : 'Erreur lors du chargement des projets.'}</p>
                )}
            </div>
        </div>
    );
}
