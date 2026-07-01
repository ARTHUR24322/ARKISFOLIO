import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import BotpressChat from '../components/BotpressChat';
import AnalyticsTracker from '../components/AnalyticsTracker';

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-main',
    display: 'swap',
    weight: ['300', '400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
    display: 'swap',
    weight: ['400', '500'],
});

export const metadata = {
    metadataBase: new URL('https://arthur-portfolio-v2.vercel.app'), // Replace with actual domain when ready
    title: {
        default: 'Arkis Digital SARL — Développeur créatif, Designer 3D & Créateur d\'agents IA',
        template: '%s | Arkis Digital SARL'
    },
    description:
        'Arthur Kisumbule, expert en expériences digitales immersives et systèmes intelligents. Développement Next.js, Design 3D avec Three.js et automatisation via agents IA.',
    keywords: [
        'développeur web',
        'design 3D',
        'agents IA',
        'freelance Next.js',
        'Three.js expert',
        'automatisation business',
        'Arthur Kisumbule',
        'digital experience designer',
        'UX/UI 3D'
    ],
    authors: [{ name: 'Arthur Kisumbule', url: 'https://www.linkedin.com/in/arthur-kisumbule-1b5416301' }],
    creator: 'Arkis Digital SARL',
    publisher: 'Arkis Digital SARL',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Arkis Digital SARL — Développeur créatif & Créateur d\'agents IA',
        description: 'Conception d\'expériences digitales immersives et de systèmes intelligents pour startups ambitieuses.',
        url: '/',
        siteName: 'Arkis Digital SARL',
        locale: 'fr_FR',
        type: 'website',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Arthur Kisumbule — Développeur créatif & Designer 3D',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Arkis Digital SARL — Développeur créatif & Créateur d\'agents IA',
        description: 'Expériences digitales immersives et systèmes intelligents.',
        creator: '@arthurkisumbule', // Optional: replace with actual handle
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    category: 'technology',
};



export default function RootLayout({ children }) {
    return (
        <html lang="fr" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
            <body>
                <AnalyticsTracker />
                {children}
                <BotpressChat />
            </body>
        </html>
    );
}
