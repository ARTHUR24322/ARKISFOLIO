'use client';
import { useEffect } from 'react';
import Script from 'next/script';
import styles from './AIAssistantSection.module.css';

export default function AIAssistantSection() {
    const initBotpress = () => {
        if (window.botpress) {
            window.botpress.on("webchat:ready", () => {
                window.botpress.open();
            });
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
                "selector": "#webchat",
                "themeName": "prism", // Assuming a modern theme, or matching site
                "frontendVersion": "v1",
                "useSessionStorage": true,
                "enableConversationDeletion": true,
                "showPoweredBy": false,
            });
        }
    };

    return (
        <section id="ai-assistant" className={styles.section}>
            <div className="container">
                <div className={styles.titleWrapper}>
                    <p className="section-label">Assistant IA</p>
                    <h2 className={styles.title}>Une question ? <span className="gradient-text">Mon IA vous répond.</span></h2>
                    <p className={styles.subtitle}>
                        Besoin d'aide pour trouver un service, voir mes réalisations ou discuter d'un projet ?
                        Demandez-le directement à mon assistant intelligent.
                    </p>
                </div>

                <div className={styles.chatContainer}>
                    <div id="webchat" className={styles.webchat}></div>
                </div>
            </div>

            <Script
                src="https://cdn.botpress.cloud/desk/webchat/v4.0/inject.js"
                onLoad={initBotpress}
            />
        </section>
    );
}
