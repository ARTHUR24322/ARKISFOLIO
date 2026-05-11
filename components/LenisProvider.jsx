'use client';
import { useEffect } from 'react';

export default function LenisProvider() {
    useEffect(() => {
        let lenis;
        (async () => {
            const LenisModule = await import('lenis');
            const Lenis = LenisModule.default;
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smooth: true,
            });

            const { gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        })();

        return () => {
            if (lenis) lenis.destroy();
        };
    }, []);

    return null;
}
