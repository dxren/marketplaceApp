import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import DevNotesModal from "../components/Modals/DevNotesModal";


const ProductDisplay = () => (
    <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div className="description" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', fontWeight: '600' }}>Fractal Marketplace is a services directory for Fractal members and friends to identify and exchange our skills with one another. </p>
            <p style={{ fontSize: '1.25rem', fontWeight: '400' }}> Created by Sarah B, Dorothy R, and Steven S for Fractal Dev Accelerator. Please share feedback to <a href="mailto:dorothy.x.ren@gmail.com">dorothy.x.ren@gmail.com</a> and consider supporting us to keep the project going.</p>
        </div>
        <div className="product" style={{ paddingBottom: '0.5rem' }}>
            <img
                src="/logo2.jpeg"
                alt="Fractal Marketplace"
                style={{ width: '300px', height: '300px', textShadow: '2px 2px 4px #333333' }}
            />
        </div>
    </section >
);

const Message = ({ message }: { message: string }) => (
    <section style={{ textAlign: 'center' }}>
        <p>{message}</p>
    </section>
);

export default function SupportUsPage() {
    const [message, setMessage] = useState("");
    const [showDevNotes, setShowDevNotes] = useState(false)

    const handleToggleDevNotes = () => {
        setShowDevNotes(!showDevNotes)
    }

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
        <div>
            <button onClick={handleToggleDevNotes}>View Dev Notes</button>
            {showDevNotes && <DevNotesModal onButtonClick={handleToggleDevNotes} />}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: '8px 30px',
                gap: '15px',
                borderRadius: '10px',
                maxHeight: '80vh',
                marginBottom: '200px',
                paddingBottom: '150px',
                width: 'calc(100vw - 100px)',
                color: '#fff9e6',
                position: 'relative',
                border: '1px outset #fff9e6',
                background: 'linear-gradient(347deg in oklab, rgb(0% 92% 99% / 70%) -15% -15%, rgb(84% 0% 55% / 71%) 132% 132%)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                fontSize: '0.9rem',
                overflowY: 'auto',
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    {message ? (
                        <Message message={message} />
                    ) : (
                        <ProductDisplay />
                    )}
                    <div className="description" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Thanks for checking us out!</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <form action={`${import.meta.env.VITE_SERVER_URL}/stripe/create-checkout-session/subscription`} method="POST">
                            <button style={{ fontSize: '1.0rem', padding: '1rem 2rem', borderRadius: '12px' }}>$5/month</button>
                        </form>
                        <form action={`${import.meta.env.VITE_SERVER_URL}/stripe/create-checkout-session/payment`} method="POST">
                            <button style={{ fontSize: '1.0rem', padding: '1rem 2rem', borderRadius: '12px' }}>One Time Donation</button>
                        </form>
                    </div>
                    <div style={{ paddingTop: '1rem' }}><Link to="/">Return to homepage</Link></div>
                </div>
            </div>
        </div>
    )
}

