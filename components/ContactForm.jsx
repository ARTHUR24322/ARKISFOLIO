'use client';
import { useState } from 'react';
import styles from './ContactForm.module.css';

export default function ContactForm() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState({ loading: false, success: false, error: null });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: null });

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setStatus({ loading: false, success: true, error: null });
                setFormData({ name: '', email: '', message: '' });
                // Reset success message after 5 seconds
                setTimeout(() => setStatus(s => ({ ...s, success: false })), 5000);
            } else {
                const data = await res.json();
                let errorMessage = data.error || 'Erreur lors de l\'envoi';
                
                // Handle zod specific validation errors
                if (data.details) {
                    if (data.details.message?._errors?.length > 0) {
                        errorMessage = data.details.message._errors[0];
                    } else if (data.details.name?._errors?.length > 0) {
                        errorMessage = data.details.name._errors[0];
                    } else if (data.details.email?._errors?.length > 0) {
                        errorMessage = data.details.email._errors[0];
                    }
                }
                
                setStatus({ loading: false, success: false, error: errorMessage });
            }
        } catch (err) {
            setStatus({ loading: false, success: false, error: 'Erreur de connexion au serveur' });
        }
    };

    return (
        <section id="contact" className={styles.section}>
            <div className="container">
                <div className={styles.ctaBox}>
                    <div className={styles.ctaHeader}>
                        <h2 className={styles.ctaTitle}>Prêt à donner vie à <span className="gradient-text">votre projet ?</span></h2>
                        <p className={styles.ctaDesc}>Laissez-moi un message pour discuter de votre vision. Je vous répondrai dans les plus brefs délais.</p>
                    </div>

                    <div className={styles.contactContainer}>
                        {/* Form Side */}
                        <div className={styles.formSide}>
                            {status.success ? (
                                <div className={styles.successBox} role="status" aria-live="polite">
                                    <div className={styles.successIcon}>✓</div>
                                    <h3>Message envoyé !</h3>
                                    <p>Merci de m'avoir contacté. Je reviens vers vous très vite.</p>
                                    <button onClick={() => setStatus({ ...status, success: false })} className={styles.resetBtn}>
                                        Envoyer un autre message
                                    </button>
                                </div>
                            ) : (
                                <form className={styles.form} onSubmit={handleSubmit} id="contact-form">
                                    <div className={styles.field}>
                                        <label htmlFor="name">Nom complet</label>
                                        <input
                                            id="name"
                                            type="text"
                                            placeholder="Votre nom"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            minLength={2}
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label htmlFor="email">Email</label>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="vorte@email.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label htmlFor="message">Message</label>
                                        <textarea
                                            id="message"
                                            placeholder="Comment puis-je vous aider ?"
                                            rows="4"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            required
                                            minLength={30}
                                            maxLength={5000}
                                        ></textarea>
                                    </div>

                                    {status.error && <p className={styles.error} role="alert">{status.error}</p>}

                                    <button type="submit" className={styles.submitBtn} disabled={status.loading}>
                                        {status.loading ? 'Envoi en cours...' : 'Envoyer mon message'}
                                        <span className={styles.btnIcon}>✉</span>
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Social/Direct Info Side */}
                        <div className={styles.infoSide}>
                            <h3 className={styles.infoTitle}>Autres moyens de contact</h3>
                            <div className={styles.socialLinks}>
                                <a href="mailto:kisumbulearthur@gmail.com" className={styles.socialLink}>
                                    <span className={styles.socialIcon}>📧</span>
                                    <div className={styles.socialText}>
                                        <span className={styles.socialLabel}>Email</span>
                                        <span className={styles.socialValue}>kisumbulearthur@gmail.com</span>
                                    </div>
                                </a>
                                <a href="https://www.linkedin.com/in/arthur-kisumbule-1b5416301" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                    <span className={styles.socialIcon}>💼</span>
                                    <div className={styles.socialText}>
                                        <span className={styles.socialLabel}>LinkedIn</span>
                                        <span className={styles.socialValue}>Arthur Kisumbule</span>
                                    </div>
                                </a>
                            </div>
                            <div className={styles.availability}>
                                <p>⚡ Réponse garantie sous 24h</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
