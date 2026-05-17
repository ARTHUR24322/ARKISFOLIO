'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { messageSchema, type MessageFormData } from '../lib/validation';
import styles from './ContactForm.module.css';

export default function ContactForm() {
    const [status, setStatus] = useState({ success: false, error: null as string | null });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<MessageFormData>({
        resolver: zodResolver(messageSchema),
        defaultValues: { name: '', email: '', message: '' }
    });

    const onSubmit = async (data: MessageFormData) => {
        setStatus({ success: false, error: null });

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setStatus({ success: true, error: null });
                reset(); // Vide le formulaire
                setTimeout(() => setStatus(s => ({ ...s, success: false })), 5000);
            } else {
                const resData = await res.json();
                setStatus({ success: false, error: resData.error || 'Erreur lors de l\'envoi' });
            }
        } catch (err) {
            setStatus({ success: false, error: 'Erreur de connexion au serveur' });
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
                                <form className={styles.form} onSubmit={handleSubmit(onSubmit)} id="contact-form">
                                    <div className={styles.field}>
                                        <label htmlFor="name">Nom complet</label>
                                        <input
                                            id="name"
                                            type="text"
                                            placeholder="Votre nom"
                                            {...register("name")}
                                        />
                                        {errors.name && <p className={styles.error} role="alert">{errors.name.message}</p>}
                                    </div>
                                    <div className={styles.field}>
                                        <label htmlFor="email">Email</label>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="votre@email.com"
                                            {...register("email")}
                                        />
                                        {errors.email && <p className={styles.error} role="alert">{errors.email.message}</p>}
                                    </div>
                                    <div className={styles.field}>
                                        <label htmlFor="message">Message</label>
                                        <textarea
                                            id="message"
                                            placeholder="Comment puis-je vous aider ?"
                                            rows={4}
                                            {...register("message")}
                                        ></textarea>
                                        {errors.message && <p className={styles.error} role="alert">{errors.message.message}</p>}
                                    </div>

                                    {status.error && <p className={styles.error} role="alert">{status.error}</p>}

                                    <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                                        {isSubmitting ? 'Envoi en cours...' : 'Envoyer mon message'}
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
