import React from 'react';
import SEO from '@/pages/components/SEO';
import styles from './LinkPages.module.css';

const LinksPage = () => {
    return (
        <div className={styles.container}>
            <SEO
                title="Links"
                description="Todos os links de Juliano Pereira (@juliano340) — redes, projetos e conteúdo."
                path="/links"
            />
            <h1 className={styles.title}>Links Page</h1>
            <p className={styles.description}>Welcome to the Links Page!</p>
        </div>
    );
};

export default LinksPage;