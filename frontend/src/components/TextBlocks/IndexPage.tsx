import React from 'react';
import styles from './indextext.module.css';

interface IndexTextProps {
    openModal: () => void;
}

function IndexText ({ openModal }: IndexTextProps) {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                Welcome to Fractal Marketplace!
            </h1>
            <p className={styles.subtitle}>
                Create a profile to start sharing your skills!
            </p>
            <p className={styles.codeOfConduct}>
                Check out our <a href="#" onClick={openModal} className={styles.link}>Code of Conduct</a> for how we expect our community members to treat each other.
            </p>
        </div>
    );
};

export default IndexText