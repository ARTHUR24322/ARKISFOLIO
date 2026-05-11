'use client';

import Script from 'next/script';
import { useState } from 'react';
import styles from './BotpressChat.module.css';

export default function BotpressChat() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        if (window.botpress) {
            if (isOpen) {
                window.botpress.sendEvent({ type: 'hide' });
            } else {
                window.botpress.sendEvent({ type: 'show' });
            }
            setIsOpen(!isOpen);
        }
    };

    return (
        <>
            <Script
                src="https://cdn.botpress.cloud/desk/webchat/v4.0/inject.js"
                strategy="afterInteractive"
                onLoad={() => {
                    if (window.botpress) {
                        window.botpress.init({
                            "botId": process.env.NEXT_PUBLIC_BOTPRESS_BOT_ID,
                            "configuration": {
                                "website": {},
                                "email": {},
                                "phone": {},
                                "termsOfService": {},
                                "privacyPolicy": {}
                            },
                            "clientId": process.env.NEXT_PUBLIC_BOTPRESS_CLIENT_ID,
                            "frontendVersion": "v1",
                            "useSessionStorage": true,
                            "showPoweredBy": false,
                            "themeName": "prism",
                            "showLauncher": false,
                        });

                        // Hack supplémentaire pour masquer le bouton s'il apparaît plus tard
                        const observer = new MutationObserver((mutations) => {
                            const launcher = document.querySelector('.bp-widget-launcher') || 
                                           document.querySelector('#bp-widget-launcher') ||
                                           document.querySelector('[class*="launcher"]'); // Botpress change souvent les classes
                            if (launcher && launcher.style.display !== 'none') {
                                launcher.style.display = 'none';
                                // Si c'est une iframe, on essaye de la masquer
                                const iframes = document.querySelectorAll('iframe');
                                iframes.forEach(iframe => {
                                    if (iframe.src.includes('botpress') && !iframe.id.includes('chat')) {
                                        // hide if it looks like a launcher
                                    }
                                });
                            }
                        });
                        observer.observe(document.body, { childList: true, subtree: true });
                    }
                }}
            />

            {!isOpen && (
                <div className={styles.launcher} onClick={toggleChat} title="Parler avec mon assistant IA">
                    <div className={styles.glow} />
                    <img src="/bot-icon.png" alt="Bot" className={styles.botIcon} />
                    {/* On ajoute une petite main SVG qui s'anime séparément pour un effet plus réaliste */}
                    <div className={styles.hand}>
                        <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
                            <path d="M12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9z" fill="white" opacity="0.2"/>
                            <path d="M16 11V7a2 2 0 0 0-4 0v4m0 0V8a2 2 0 0 0-4 0v5" stroke="#4F8EF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 13.5V11a2 2 0 0 1 4 0v2.5m4-2.5a2 2 0 0 1 2 2V15a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5v-1" stroke="#4F8EF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
            )}

            {/* Bouton pour fermer si le chat est ouvert et recouvre l'écran */}
            {isOpen && (
                <button 
                    onClick={toggleChat}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        zIndex: 10000,
                        background: '#e11d48',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        cursor: 'pointer',
                        fontSize: '20px'
                    }}
                >
                    ×
                </button>
            )}
        </>
    );
}
