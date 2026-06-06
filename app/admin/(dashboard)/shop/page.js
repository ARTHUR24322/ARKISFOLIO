'use client';
import { useState, useEffect } from 'react';
import styles from './shop.module.css';

export default function AdminShop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({
        title: '', type: 'template', description: '', features: '', price: 0, currency: '€', emoji: '🛍️', published: true, badge: '', featured: false, externalLink: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/products?all=true');
            const data = await res.json();
            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                console.error('API Error:', data);
                alert(data.error || 'Erreur lors du chargement des produits');
            }
        } catch (err) {
            alert('Erreur lors du chargement des produits');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const method = currentProduct.id ? 'PUT' : 'POST';

        const formData = new FormData();
        if (currentProduct.id) formData.append('id', currentProduct.id);
        formData.append('title', currentProduct.title);
        formData.append('type', currentProduct.type);
        formData.append('description', currentProduct.description);
        formData.append('price', currentProduct.price);
        formData.append('currency', currentProduct.currency);
        formData.append('emoji', currentProduct.emoji);
        formData.append('badge', currentProduct.badge);
        formData.append('published', currentProduct.published);
        formData.append('featured', currentProduct.featured);
        formData.append('externalLink', currentProduct.externalLink || '');

        const features = typeof currentProduct.features === 'string'
            ? currentProduct.features.split(',').map(s => s.trim())
            : currentProduct.features;
        formData.append('features', JSON.stringify(features));

        if (currentProduct.imageFile) {
            formData.append('image', currentProduct.imageFile);
        }

        try {
            const res = await fetch('/api/products', {
                method,
                body: formData,
            });

            if (res.ok) {
                setIsEditing(false);
                fetchProducts();
            } else {
                alert('Erreur lors de la sauvegarde');
            }
        } catch (err) {
            alert('Erreur serveur');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer ce produit ?')) return;
        try {
            const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchProducts();
        } catch (err) {
            alert('Erreur serveur');
        }
    };

    const openEdit = (product) => {
        setCurrentProduct({
            ...product,
            features: Array.isArray(product.features) ? product.features.join(', ') : product.features
        });
        setIsEditing(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Gestion de la Boutique</h1>
                <button
                    onClick={() => {
                        setIsEditing(true);
                        setCurrentProduct({ title: '', type: 'template', description: '', features: '', price: 0, currency: '€', emoji: '🛍️', published: true, badge: '', featured: false, externalLink: '' });
                    }}
                    className={styles.addBtn}
                >
                    + Nouveau Produit
                </button>
            </div>

            {isEditing && (
                <div className={styles.modal}>
                    <form className={styles.form} onSubmit={handleSave}>
                        <h2>{currentProduct.id ? 'Modifier' : 'Ajouter'} un produit</h2>

                        <div className={styles.row}>
                            <div className={styles.f}>
                                <label>Titre</label>
                                <input value={currentProduct.title} onChange={e => setCurrentProduct({ ...currentProduct, title: e.target.value })} required />
                            </div>
                            <div className={styles.f}>
                                <label>Type</label>
                                <select value={currentProduct.type} onChange={e => setCurrentProduct({ ...currentProduct, type: e.target.value })}>
                                    <option value="template">Template</option>
                                    <option value="service">Service</option>
                                    <option value="pack">Pack</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.f}>
                            <label>Description</label>
                            <textarea value={currentProduct.description} onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })} rows="2" required />
                        </div>

                        <div className={styles.f}>
                            <label>Image du produit</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const previewUrl = URL.createObjectURL(file);
                                        setCurrentProduct({ ...currentProduct, imageFile: file, previewUrl });
                                    }
                                }}
                            />
                            {(currentProduct.previewUrl || currentProduct.imageUrl) && (
                                <div className={styles.previewContainer}>
                                    <p className={styles.previewLabel}>Prévisualisation :</p>
                                    <img src={currentProduct.previewUrl || currentProduct.imageUrl} className={styles.smallPreview} alt="Preview" />
                                </div>
                            )}
                        </div>

                        <div className={styles.f}>
                            <label>Fonctionnalités (séparées par virgule)</label>
                            <input value={currentProduct.features} onChange={e => setCurrentProduct({ ...currentProduct, features: e.target.value })} placeholder="Next.js 14, Stripe, Responsive" />
                        </div>
                        
                        <div className={styles.f}>
                            <label>Lien Externe (Optionnel - Redirige l'achat vers ce lien)</label>
                            <input value={currentProduct.externalLink} onChange={e => setCurrentProduct({ ...currentProduct, externalLink: e.target.value })} placeholder="https://gumroad.com/l/..." />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.f}>
                                <label>Prix</label>
                                <input type="number" value={currentProduct.price} onChange={e => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })} required />
                            </div>
                            <div className={styles.f}>
                                <label>Devise</label>
                                <input value={currentProduct.currency} onChange={e => setCurrentProduct({ ...currentProduct, currency: e.target.value })} maxLength="3" />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.f}>
                                <label>Badge (Vente flash, Nouveau...)</label>
                                <input value={currentProduct.badge} onChange={e => setCurrentProduct({ ...currentProduct, badge: e.target.value })} />
                            </div>
                            <div className={styles.f}>
                                <label>Emoji</label>
                                <input value={currentProduct.emoji} onChange={e => setCurrentProduct({ ...currentProduct, emoji: e.target.value })} />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.fCheckbox}>
                                <label><input type="checkbox" checked={currentProduct.published} onChange={e => setCurrentProduct({ ...currentProduct, published: e.target.checked })} /> Publié</label>
                            </div>
                            <div className={styles.fCheckbox}>
                                <label><input type="checkbox" checked={currentProduct.featured} onChange={e => setCurrentProduct({ ...currentProduct, featured: e.target.checked })} /> Mettre en avant</label>
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
                ) : Array.isArray(products) && products.length > 0 ? (
                    products.map(p => (
                        <div key={p.id} className={styles.itemCard}>
                            <div className={styles.itemMain}>
                                <span className={styles.itemEmoji}>{p.emoji}</span>
                                <div>
                                    <h3>{p.title}</h3>
                                    <div className={styles.itemMeta}>
                                        <span className={styles.itemPrice}>{p.price}{p.currency}</span>
                                        <span className={styles.itemType}>{p.type}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.itemActions}>
                                <button onClick={() => openEdit(p)}>Modifier</button>
                                <button onClick={() => handleDelete(p.id)} className={styles.delete}>Supprimer</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>{loading ? '' : products && products.length === 0 ? 'Aucun produit trouvé.' : 'Erreur lors du chargement.'}</p>
                )}
            </div>
        </div>
    );
}
