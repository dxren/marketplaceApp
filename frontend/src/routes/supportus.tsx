import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from './supportus.module.css';

export function ProductDisplay() {
    return (
        <>
            <section className={styles.productSection}>
                <div className={`${styles.description} ${styles.mainDescription}`}>
                    <p className={styles.mainTitle}>Fractal Marketplace is a services directory for Fractal members and friends to identify and exchange our skills with one another.</p>
                    <p className={styles.subTitle}>Created by Sarah B, Dorothy R, and Steven S for Fractal Dev Accelerator. Please share feedback to <a href="mailto:dorothy.x.ren@gmail.com">dorothy.x.ren@gmail.com</a> and consider supporting us to keep the project going.</p>
                </div>
                <div className={styles.productLogo}>
                    <img
                        src="/logo2.jpeg"
                        alt="Fractal Marketplace"
                        className={styles.logo}
                    />
                </div>
            </section>
        </>
    )
}

const Message = ({ message }: { message: string }) => (
    <section className={styles.messageSection}>
        <p>{message}</p>
    </section>
);

export default function SupportUsPage() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);

        if (query.get("success")) {
            setMessage("Order placed! You will receive an email confirmation.");
        }

        if (query.get("canceled")) {
            setMessage(
                "Order canceled -- continue to shop around and checkout when you're ready."
            );
        }
    }, []);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.contentContainer}>
                <div className={styles.innerContent}>
                    {message ? (
                        <Message message={message} />
                    ) : (
                        <ProductDisplay />
                    )}

                    <div className={`${styles.description} ${styles.thankYouDescription}`}>
                        <p>Thanks for checking us out!</p>
                    </div>
                    <div className={styles.buttonContainer}>
                        <form action={`${import.meta.env.VITE_SERVER_URL}/stripe/create-checkout-session/subscription`} method="POST">
                            <button className={`${styles.button} ${styles.subscriptionButton}`}>$5/month</button>
                        </form>
                        <form action={`${import.meta.env.VITE_SERVER_URL}/stripe/create-checkout-session/payment`} method="POST">
                            <button className={`${styles.button} ${styles.donationButton}`}>One Time Donation</button>
                        </form>
                    </div>
                    <div className={styles.homeLink}><Link to="/">Return to homepage</Link></div>
                    
                    <div className={styles.devNotes}>
                        <p>
                            Dev Notes August 2024: Thank you for reading our first set of dev Notes for Fractal Marketplace. 
                            We are working on releasing messaging between users and rate limiting 
                            the number of posts per minute (to handle spam). If you find any bugs 
                            or have feature requests, let us know!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}