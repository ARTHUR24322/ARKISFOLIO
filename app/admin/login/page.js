'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('email'); // 'email' or 'otp'
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, action: 'request_otp' }),
            });
            const data = await res.json();

            if (res.ok) {
                setStep('otp');
            } else {
                setError(data.error || 'Erreur lors de la demande du code');
            }
        } catch (err) {
            setError('Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, action: 'verify_otp' }),
            });
            const data = await res.json();

            if (res.ok) {
                router.push('/admin');
                router.refresh();
            } else {
                setError(data.error || 'Code incorrect');
            }
        } catch (err) {
            setError('Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.logo}>AK</div>
                    <h1>Administration</h1>
                    <p>{step === 'email' ? 'Identifiez-vous pour gérer le portfolio' : 'Saisissez le code reçu par email'}</p>
                </div>

                {step === 'email' ? (
                    <form onSubmit={handleRequestOtp} className={styles.form}>
                        {error && <div className={styles.error}>{error}</div>}

                        <div className={styles.field}>
                            <label>Email Administrateur</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="votre-email@gmail.com"
                                required
                            />
                        </div>

                        <button type="submit" className={styles.button} disabled={loading}>
                            {loading ? 'Envoi...' : 'Recevoir le code'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className={styles.form}>
                        {error && <div className={styles.error}>{error}</div>}

                        <div className={styles.field}>
                            <label>Code à 6 chiffres</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="123456"
                                maxLength={6}
                                pattern="\d{6}"
                                required
                            />
                        </div>

                        <button type="submit" className={styles.button} disabled={loading}>
                            {loading ? 'Vérification...' : 'Se connecter'}
                        </button>
                        <button 
                            type="button" 
                            className={styles.button} 
                            style={{ background: 'transparent', color: '#4F8EF7', marginTop: '10px' }}
                            onClick={() => setStep('email')}
                        >
                            Retour
                        </button>
                    </form>
                )}

                <div className={styles.footer}>
                    <a href="/">Retour au site</a>
                </div>
            </div>
        </div>
    );
}
