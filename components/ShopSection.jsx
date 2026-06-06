'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './ShopSection.module.css';

const types = ['Tous', 'template', 'service', 'pack'];
const typeLabels = { 'Tous': 'Tous', 'template': 'Templates', 'service': 'Services', 'pack': 'Packs' };

export default function ShopSection() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState('Tous');
    const [paymentModal, setPaymentModal] = useState({ open: false, product: null, method: null });
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isPaying, setIsPaying] = useState(false);
    const [paymentResult, setPaymentResult] = useState(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    console.error('Data is not an array:', data);
                    setProducts([]);
                }
            } catch (err) {
                console.error(err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filtered = active === 'Tous' ? products : products.filter((p) => p.type === active);

    useEffect(() => {
        (async () => {
            const { gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            gsap.fromTo(
                '.shop-title',
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: '#shop', start: 'top 80%' } }
            );
            gsap.fromTo(
                '.shop-subtitle',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, delay: 0.2, scrollTrigger: { trigger: '#shop', start: 'top 80%' } }
            );
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const { gsap } = await import('gsap');
            gsap.fromTo(
                cardsRef.current.filter(Boolean),
                { opacity: 0, y: 40, scale: 0.96 },
                { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
            );
        })();
    }, [active, products]);

    const handleInitialBuy = (product) => {
        // Tracker le clic
        fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'click' }),
        }).catch(() => {});

        if (product.externalLink) {
            window.open(product.externalLink, '_blank');
            return;
        }
        setPaymentModal({ open: true, product, method: null });
        setPaymentResult(null);
        setPhoneNumber('');
    };

    const handleProcessPayment = async (e) => {
        e.preventDefault();
        setIsPaying(true);
        setPaymentResult(null);

        const { product, method } = paymentModal;
        const endpoints = {
            mpesa: '/api/payment/mpesa',
            orange: '/api/payment/orange',
            flutterwave: '/api/payment/flutterwave',
            airtel: '/api/payment/airtel',
            '2checkout': '/api/payment/2checkout',
            paypal: '/api/payment/paypal'
        };
        const apiEndpoint = endpoints[method];

        try {
            const res = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: phoneNumber,
                    amount: product.price,
                    productId: product.id,
                    productTitle: product.title
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setPaymentResult({ success: true, message: data.message });
                
                // Tracker la vente (simulation)
                fetch('/api/analytics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'sale', amount: product.price }),
                }).catch(() => {});

                if (data.paymentUrl) {
                    window.open(data.paymentUrl, '_blank');
                }
            } else {
                setPaymentResult({ success: false, message: data.error || 'Erreur lors du paiement' });
            }
        } catch (err) {
            setPaymentResult({ success: false, message: 'Erreur de connexion au serveur' });
        } finally {
            setIsPaying(false);
        }
    };

    return (
        <section id="shop" className={styles.section}>
            {/* Background glow */}
            <div className={styles.bgGlow} />
            <div className={styles.bgGlow2} />

            <div className="container">
                <p className="section-label">Boutique</p>
                <h2 className={`${styles.heading} shop-title`}>
                    Templates & Services{' '}
                    <span className="gradient-text">à la vente</span>
                </h2>
                <p className={`${styles.subtitle} shop-subtitle`}>
                    Des ressources prêtes à l'emploi et des services sur-mesure pour accélérer votre projet.
                </p>

                {/* Type filters */}
                <div className={styles.filters}>
                    {types.map((t) => (
                        <button
                            key={t}
                            onClick={() => setActive(t)}
                            className={`${styles.filter} ${active === t ? styles.filterActive : ''}`}
                        >
                            {typeLabels[t]}
                        </button>
                    ))}
                </div>

                {/* Products grid */}
                <div className={styles.grid}>
                    {loading ? (
                        <p aria-busy="true">Chargement de la boutique...</p>
                    ) : (
                        filtered.map((product, i) => (
                            <div
                                key={product.id}
                                ref={(el) => (cardsRef.current[i] = el)}
                                className={`${styles.card} ${product.featured ? styles.cardFeatured : ''}`}
                                style={{ '--accent': product.accent }}
                            >
                                {product.featured && <div className={styles.featuredFlag}>BEST VALUE</div>}

                                <div className={styles.cardTop} style={{ background: product.gradient }}>
                                    {product.imageUrl ? (
                                        <div className={styles.imageWrap}>
                                            <Image 
                                                src={product.imageUrl} 
                                                alt={product.title} 
                                                fill 
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                className={styles.productImage} 
                                            />
                                        </div>
                                    ) : (
                                        <span className={styles.cardEmoji}>{product.emoji}</span>
                                    )}
                                    {product.badge && <span className={styles.badge}>{product.badge}</span>}
                                </div>

                                <div className={styles.cardBody}>
                                    <h3 className={styles.cardTitle}>{product.title}</h3>
                                    <p className={styles.cardDesc}>{product.description}</p>

                                    <ul className={styles.features}>
                                        {product.features.map((f) => (
                                            <li key={f} className={styles.feature}>
                                                <span className={styles.featureCheck}>✓</span>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className={styles.cardFooter}>
                                        <div className={styles.price}>
                                            <span className={styles.priceAmount}>{product.price}</span>
                                            <span className={styles.priceCurrency}>{product.currency}</span>
                                        </div>
                                        <button className={styles.cta} onClick={() => handleInitialBuy(product)}>
                                            {product.cta || 'Acheter'}
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Custom order CTA */}
                <div className={styles.customCta}>
                    <div className={styles.customCtaInner}>
                        <div className={styles.customCtaLeft}>
                            <span className={styles.customCtaEmoji}>💬</span>
                            <div>
                                <p className={styles.customCtaTitle}>Besoin de quelque chose de spécifique ?</p>
                                <p className={styles.customCtaDesc}>Contactez-moi pour un devis personnalisé adapté à vos besoins et votre budget.</p>
                            </div>
                        </div>
                        <a href="#contact" className={styles.customCtaBtn}>
                            Demander un devis
                        </a>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {paymentModal.open && (
                <div 
                    className={styles.modalOverlay} 
                    role="dialog" 
                    aria-modal="true" 
                    aria-labelledby="payment-modal-title"
                >
                    <div className={styles.modalContent}>
                        <button 
                            className={styles.closeBtn} 
                            onClick={() => setPaymentModal({ open: false, product: null, method: null })}
                            aria-label="Fermer la fenêtre de paiement"
                        >×</button>

                        <div className={styles.modalHeader}>
                            <h2 id="payment-modal-title">Paiement Mobile Money</h2>
                            <p>Produit : <strong>{paymentModal.product.title}</strong> — {paymentModal.product.price}{paymentModal.product.currency}</p>
                        </div>

                        {!paymentModal.method ? (
                            <div className={styles.methodChoice}>
                                <p>Choisissez votre moyen de paiement :</p>
                                <div className={styles.methodGrid}>
                                    <button onClick={() => setPaymentModal({ ...paymentModal, method: 'mpesa' })} className={styles.methodBtn}>
                                        <div className={styles.mpesaLogo}>M-Pesa</div>
                                        <span>Vodacom M-Pesa</span>
                                    </button>
                                    <button onClick={() => setPaymentModal({ ...paymentModal, method: 'orange' })} className={styles.methodBtn}>
                                        <div className={styles.orangeLogo}>Orange</div>
                                        <span>Orange Money</span>
                                    </button>
                                    <button onClick={() => setPaymentModal({ ...paymentModal, method: 'airtel' })} className={styles.methodBtn}>
                                        <div className={styles.airtelLogo}>Airtel</div>
                                        <span>Airtel Money</span>
                                    </button>
                                    <button onClick={() => setPaymentModal({ ...paymentModal, method: 'paypal' })} className={styles.methodBtn}>
                                        <div className={styles.paypalLogo}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.723a.641.641 0 0 1 .633-.535h7.45c1.51 0 2.738.31 3.687.93 1.225.8 1.797 2.121 1.7 3.923-.1 1.902-1.127 3.391-2.617 4.144-1.135.574-2.522.842-4.123.842H9.011l-1.071 6.78a.641.641 0 0 1-.632.53h-.232z" opacity=".5"/>
                                                <path d="M10.224 16.518h-2.1l1.104-6.985a.64.64 0 0 1 .633-.531h7.45c1.51 0 2.738.31 3.687.93 1.225.8 1.797 2.121 1.7 3.923-.1 1.902-1.127 3.391-2.617 4.144-1.135.574-2.522.842-4.123.842h-2.115l-1.071 6.78a.747.747 0 0 1-.741.63h-3.414a.526.526 0 0 1-.519-.607l1.121-7.114a.64.64 0 0 1 .632-.53h.007z"/>
                                            </svg>
                                        </div>
                                        <span>PayPal</span>
                                    </button>
                                    <button disabled className={`${styles.methodBtn} ${styles.methodBtnDisabled}`}>
                                        <div className={styles.flutterwaveLogo}>FW</div>
                                        <span>Flutterwave (Bientôt)</span>
                                    </button>
                                    <button disabled className={`${styles.methodBtn} ${styles.methodBtnDisabled}`}>
                                        <div className={styles.tcoLogo}>2CO</div>
                                        <span>2Checkout (Bientôt)</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form className={styles.paymentForm} onSubmit={handleProcessPayment}>
                                <button type="button" className={styles.backBtn} onClick={() => { setPaymentModal({ ...paymentModal, method: null }); setPaymentResult(null); }}>← Changer de méthode</button>

                                <div className={styles.methodBanner} style={{
                                    background:
                                        paymentModal.method === 'mpesa' ? '#E60000' :
                                            paymentModal.method === 'orange' ? '#FF7900' :
                                                paymentModal.method === 'airtel' ? '#FF0000' :
                                                    paymentModal.method === 'flutterwave' ? '#F5A623' :
                                                        '#000'
                                }}>
                                    {paymentModal.method === 'mpesa' ? 'Vodacom M-Pesa' :
                                        paymentModal.method === 'orange' ? 'Orange Money' :
                                            paymentModal.method === 'airtel' ? 'Airtel Money' :
                                                paymentModal.method === 'flutterwave' ? 'Flutterwave' :
                                                    paymentModal.method === 'paypal' ? 'PayPal International' :
                                                        '2Checkout'}
                                </div>

                                {paymentResult ? (
                                    <div className={`${styles.resultBanner} ${paymentResult.success ? styles.success : styles.error}`}>
                                        <div className={styles.resultIcon}>{paymentResult.success ? '✅' : '❌'}</div>
                                        <p>{paymentResult.message}</p>
                                        {paymentResult.success && <button type="button" onClick={() => setPaymentModal({ open: false, product: null, method: null })} className={styles.closeModalBtn}>Fermer</button>}
                                    </div>
                                ) : (
                                    <>
                                        {paymentModal.method !== 'paypal' ? (
                                            <>
                                                <div className={styles.inputGroup}>
                                                    <label>Votre numéro de téléphone (RDC)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="0810000000 ou 243..."
                                                        value={phoneNumber}
                                                        onChange={e => setPhoneNumber(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <button type="submit" className={styles.paySubmitBtn} disabled={isPaying}>
                                                    {isPaying ? 'Traitement...' : `Payer ${paymentModal.product.price}${paymentModal.product.currency}`}
                                                </button>
                                                <p className={styles.disclaimer}>Vous recevrez une demande de confirmation sur votre téléphone après avoir cliqué sur payer.</p>
                                            </>
                                        ) : (
                                            <>
                                                <div className={styles.paypalInfo}>
                                                    <p>Vous allez être redirigé vers le site sécurisé de PayPal pour finaliser votre achat.</p>
                                                </div>
                                                <button type="submit" className={`${styles.paySubmitBtn} ${styles.paypalSubmitBtn}`} disabled={isPaying}>
                                                    {isPaying ? 'Préparation...' : `Payer avec PayPal (${paymentModal.product.price}${paymentModal.product.currency})`}
                                                </button>
                                                <p className={styles.disclaimer}>Paiement sécurisé par PayPal. Cartes bancaires acceptées.</p>
                                            </>
                                        )}
                                    </>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
