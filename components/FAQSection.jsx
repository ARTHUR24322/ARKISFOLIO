'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './FAQSection.module.css';

const faqs = [
    {
        question: "Combien de temps faut-il pour créer un site internet ?",
        answer: "Le délai dépend de la complexité du projet. Un site vitrine simple peut prendre 2 à 4 semaines, tandis qu'une plateforme e-commerce ou une application sur-mesure (avec IA ou 3D) peut nécessiter 1 à 3 mois. Un planning détaillé est toujours fourni après notre premier appel."
    },
    {
        question: "Proposez-vous de la maintenance après la mise en ligne ?",
        answer: "Oui, absolument ! La mise en ligne n'est que le début. Je propose des forfaits de maintenance pour assurer la sécurité, les mises à jour et les petites évolutions de votre site ou de votre agent IA."
    },
    {
        question: "Comment intégrez-vous l'Intelligence Artificielle à mon entreprise ?",
        answer: "Nous commençons par analyser vos processus actuels. L'IA peut intervenir à plusieurs niveaux : automatisation du support client via des agents conversationnels (comme Botpress), tri de données, génération de contenu ou analyse de marché. L'intégration se fait sur-mesure selon vos besoins spécifiques."
    },
    {
        question: "Les expériences 3D fonctionnent-elles sur tous les appareils ?",
        answer: "Oui, les expériences 3D que je crée avec Three.js et WebGL sont optimisées pour fonctionner de manière fluide sur un maximum d'appareils, y compris les smartphones, sans nécessiter l'installation d'une application tierce."
    },
    {
        question: "Combien coûtent vos services ?",
        answer: "Chaque projet étant unique, le budget varie en fonction des fonctionnalités requises, du design et du temps de développement. Je propose des forfaits adaptés aussi bien aux startups qu'aux entreprises établies. Contactez-moi pour un devis personnalisé, le premier appel estimatif est 100% gratuit."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState(null);
    const sectionRef = useRef(null);

    useEffect(() => {
        (async () => {
            const { gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            gsap.fromTo(
                sectionRef.current,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 85%',
                    }
                }
            );
        })();
    }, []);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className={styles.section} ref={sectionRef}>
            <div className="container">
                <p className="section-label">FAQ</p>
                <h2 className={styles.heading}>
                    Questions <span className="gradient-text">fréquentes</span>
                </h2>

                <div className={styles.accordion}>
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div 
                                key={index} 
                                className={`${styles.item} ${isOpen ? styles.open : ''}`}
                            >
                                <button
                                    className={styles.question}
                                    onClick={() => toggleFAQ(index)}
                                    aria-expanded={isOpen}
                                >
                                    <span>{faq.question}</span>
                                    <svg 
                                        className={styles.icon} 
                                        width="24" 
                                        height="24" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                    >
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>
                                <div 
                                    className={styles.answerWrapper}
                                    style={{ 
                                        height: isOpen ? 'auto' : '0px',
                                        opacity: isOpen ? 1 : 0
                                    }}
                                >
                                    <div className={styles.answer}>
                                        <p>{faq.answer}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
