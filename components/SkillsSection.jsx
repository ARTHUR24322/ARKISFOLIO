'use client';
import { useEffect, useRef } from 'react';
import styles from './SkillsSection.module.css';

const skillGroups = [
    {
        category: 'Dev',
        icon: '💻',
        color: '#4F8EF7',
        skills: ['HTML5 & CSS3', 'JavaScript ES6+', 'React', 'Next.js', 'Node.js', 'Three.js', 'GSAP', 'REST APIs', 'PostgreSQL', 'MongoDB'],
    },
    {
        category: '3D',
        icon: '🧊',
        color: '#22D3EE',
        skills: ['Blender', 'Cinema 4D', 'Three.js / WebGL', 'Shaders GLSL', 'Motion Design', 'Rendu produit', 'Animation 3D', 'Modélisation'],
    },
    {
        category: 'IA',
        icon: '🤖',
        color: '#8B5CF6',
        skills: ['API OpenAI / Claude', 'LangChain', 'Bases vectorielles', 'Pinecone', 'n8n / Make.com', 'RAG', 'Prompt Engineering', 'Automatisation'],
    },
    {
        category: 'Design',
        icon: '✨',
        color: '#F59E0B',
        skills: ['Figma', 'UI/UX Design', 'Design System', 'Prototypage', 'Responsive Design', 'Framer', 'Brand Identity'],
    },
];

export default function SkillsSection() {
    const groupsRef = useRef([]);

    useEffect(() => {
        (async () => {
            const { gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            groupsRef.current.forEach((group, i) => {
                if (!group) return;
                gsap.fromTo(
                    group,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1, y: 0, duration: 0.6, delay: i * 0.1,
                        ease: 'power2.out',
                        scrollTrigger: { trigger: '#skills', start: 'top 80%' },
                    }
                );

                const tags = group.querySelectorAll('[data-skill]');
                gsap.fromTo(
                    tags,
                    { opacity: 0, scale: 0.8 },
                    {
                        opacity: 1, scale: 1, duration: 0.4, stagger: 0.04, delay: i * 0.1 + 0.2,
                        ease: 'back.out(1.5)',
                        scrollTrigger: { trigger: '#skills', start: 'top 80%' },
                    }
                );
            });
        })();
    }, []);

    return (
        <section id="skills" className={styles.section}>
            <div className="container">
                <p className="section-label">Compétences</p>
                <h2 className={styles.heading}>
                    La stack qui fait{' '}
                    <span className="gradient-text">la différence</span>
                </h2>

                <div className={styles.grid}>
                    {skillGroups.map((group, i) => (
                        <div
                            key={group.category}
                            ref={(el) => (groupsRef.current[i] = el)}
                            className={styles.group}
                            style={{ '--group-color': group.color, opacity: 0 }}
                        >
                            <div className={styles.groupHeader}>
                                <span className={styles.groupIcon}>{group.icon}</span>
                                <h3 className={styles.groupTitle}>{group.category}</h3>
                            </div>
                            <div className={styles.tags}>
                                {group.skills.map((skill) => (
                                    <span key={skill} data-skill className={styles.tag}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
