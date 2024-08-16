import { Link } from "react-router-dom";
import { useState, useEffect } from "react";


const ProductDisplay = () => (
    <section>
        <div className="description" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '2rem' }}>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>Fractal Marketplace is a services directory for Fractal members and friends to identify and exchange our skills with one another. </p>
            <p style={{ fontSize: '1.0rem', fontWeight: 'bold' }}> Created by Sarah B, Dorothy R, and Steven S for Fractal Dev Accelerator. Please share feedback to <a href="mailto:dorothy.x.ren@gmail.com">dorothy.x.ren@gmail.com</a> and consider supporting us to keep the project going.</p>
        </div>
        <div className="product" style={{ paddingBottom: '2rem' }}>
            <img
                src="/logo2.jpeg"
                alt="Fractal Marketplace"
                style={{ width: '400px', height: '400px', textShadow: '2px 2px 4px #333333' }}
            />
        </div>
        {/* <form action="http://localhost:8080/stripe/create-checkout-session" method="POST">
            <button type="submit">
                Checkout
            </button> */}
        {/* </form> */}
    </section >
);

const Message = ({ message }: { message: string }) => (
    <section>
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
        <>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                {message ? (
                    <Message message={message} />
                ) : (
                    <ProductDisplay />
                )}
                <div className="description" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '1rem' }}>
                    <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Thanks for checking us out!</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <form action={`${import.meta.env.VITE_SERVER_URL}/stripe/create-checkout-session/subscription`} method="POST">
                        <button style={{ fontSize: '1.0rem', padding: '1rem 2rem', borderRadius: '12px' }}>$5/month</button>
                    </form>
                    <form action={`${import.meta.env.VITE_SERVER_URL}/stripe/create-checkout-session/payment`} method="POST">
                        <button style={{ fontSize: '1.0rem', padding: '1rem 2rem', borderRadius: '12px' }}>One Time PYO</button>
                    </form>
                </div>
                <div style={{ paddingTop: '2rem' }}><Link to="/">Return to index</Link></div>
            </div>
        </>
    )
}

