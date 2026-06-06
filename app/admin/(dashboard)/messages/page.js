'use client';
import { useState, useEffect } from 'react';
import styles from './messages.module.css';

export default function AdminMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/messages');
            const data = await res.json();
            if (Array.isArray(data)) {
                setMessages(data);
            } else {
                console.error('API Error:', data);
                setMessages([]);
            }
        } catch (err) {
            console.error(err);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await fetch('/api/messages', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteMessage = async (id) => {
        if (!confirm('Supprimer ce message ?')) return;
        try {
            await fetch(`/api/messages?id=${id}`, { method: 'DELETE' });
            setMessages(messages.filter(m => m.id !== id));
            setSelectedMessage(null);
        } catch (err) {
            console.error(err);
        }
    };

    const openMessage = (msg) => {
        setSelectedMessage(msg);
        if (!msg.read) markAsRead(msg.id);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Messages Reçus</h1>
                <p>Vous avez {messages.filter(m => !m.read).length} nouveau(x) message(s).</p>
            </header>

            <div className={styles.layout}>
                <div className={styles.list}>
                    {loading ? (
                        <p>Chargement des messages...</p>
                    ) : messages.length === 0 ? (
                        <p className={styles.empty}>Aucun message pour le moment.</p>
                    ) : (
                        messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`${styles.card} ${!msg.read ? styles.unread : ''} ${selectedMessage?.id === msg.id ? styles.active : ''}`}
                                onClick={() => openMessage(msg)}
                            >
                                <div className={styles.cardHeader}>
                                    <span className={styles.name}>{msg.name}</span>
                                    <span className={styles.date}>{new Date(msg.date).toLocaleDateString()}</span>
                                </div>
                                <p className={styles.preview}>{msg.message.substring(0, 60)}...</p>
                                {!msg.read && <span className={styles.dot}></span>}
                            </div>
                        ))
                    )}
                </div>

                <div className={styles.viewer}>
                    {selectedMessage ? (
                        <div className={styles.msgContent}>
                            <div className={styles.msgHeader}>
                                <div>
                                    <h2>{selectedMessage.name}</h2>
                                    <a href={`mailto:${selectedMessage.email}`} className={styles.email}>{selectedMessage.email}</a>
                                </div>
                                <button onClick={() => deleteMessage(selectedMessage.id)} className={styles.deleteBtn}>Supprimer</button>
                            </div>
                            <div className={styles.dateFull}>Reçu le {new Date(selectedMessage.date).toLocaleString()}</div>
                            <div className={styles.body}>
                                {selectedMessage.message}
                            </div>
                            <div className={styles.actions}>
                                <a href={`mailto:${selectedMessage.email}?subject=Réponse à votre message`} className={styles.replyBtn}>Répondre par Email</a>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.placeholder}>
                            <span className={styles.icon}>✉</span>
                            <p>Sélectionnez un message pour le lire</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
