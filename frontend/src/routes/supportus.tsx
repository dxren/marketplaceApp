import { Link } from "react-router-dom";
import { useState, useEffect } from "react";


const ProductDisplay = () => (
    <section>
        <div className="product">
            <img
                src="https://i.imgur.com/EHyR2nP.png"
                alt="Fractal Marketplace"
            />
            <div className="description">
                <h3>Support us with a monthly subscription</h3>
                <h5>$5.00</h5>
            </div>
        </div>
        <form action="http://localhost:8080/stripe/create-checkout-session" method="POST">
            <button type="submit">
                Checkout
            </button>
        </form>
    </section>
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
                <div style={{ paddingTop: '2rem' }}><Link to="/">Return to index</Link></div>
            </div>
        </>
    )
}

