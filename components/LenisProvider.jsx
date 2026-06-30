'use client';
import { useEffect } from 'react';

export default function LenisProvider() {
    useEffect(() => {
        let lenis;
        let tickerCallback;
        let gsapInstance;
        
        (async () => {
            const LenisModule = await import('lenis');
            const Lenis = LenisModule.default;
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smooth: true,
            });

            const { gsap } = await import('gsap');
            gsapInstance = gsap;
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            lenis.on('scroll', ScrollTrigger.update);
            
            tickerCallback = (time) => {
                lenis.raf(time * 1000);
            };
            
            gsap.ticker.add(tickerCallback);
            gsap.ticker.lagSmoothing(0);
        })();

        return () => {
            if (lenis) lenis.destroy();
            if (gsapInstance && tickerCallback) {
                gsapInstance.ticker.remove(tickerCallback);
            }
        };
    }, []);

    return null;
}
