import { useEffect, useState } from "react"
import { useOfferService } from "../../services/offerService"
import OffersModal from "../Modals/OffersModal";
import { useAppStore } from "../../appStore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Offer } from "../../../../shared/types";

function OfferPost({ offer }: { offer: Offer }) {
    const navigate = useNavigate();
    const { userId } = useAuth();

    const handleUserClick = () => {
        if (userId && userId === offer.user.id) {
            navigate('/profile');
        } else {
            navigate(`/user/${offer.user.id}`);
        }
    };

    const flagColor = '#544bcc';
    const flagText = 'OFFERING';

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            border: '1px solid #fff9e6',
            padding: '8px 30px',
            gap: '15px',
            marginBottom: '8px',
            borderRadius: '4px',
            color: '#fff9e6',
            position: 'relative',
            background: 'linear-gradient(to right, rgba(84, 0, 55, 0.2), rgba(199, 21, 133, 0.2))',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s ease',
            fontSize: '0.9rem',
        }}>
            <div style={{
                position: 'absolute',
                top: '8px',
                right: '15px',
                padding: '2px 6px',
                borderRadius: '8px',
                backgroundColor: flagColor,
                color: '#fff9e6',
                fontFamily: 'sans-serif',
                fontSize: '0.7rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                background: `linear-gradient(135deg, ${flagColor}, ${flagColor}cc)`,
                border: `1px solid ${flagColor}33`,
                zIndex: 1,
            }}>{flagText}</div>
            <img src={offer.user?.avatarUrl || ''} alt={offer.user?.displayName || 'User'} style={{ width: '40px', height: '40px', borderRadius: '100%', backgroundColor: '#fff9e6', flexShrink: 0, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.08)' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center'}}> 
                    <div onClick={handleUserClick}
                        style={{
                            cursor: 'pointer',
                            textDecoration: 'none',
                            color: '#e8e6e6',
                            fontSize: '1rem',
                        }}>{offer.user.displayName}
                    </div>
                    <div style={{color: "#e8e6e6"}}> •</div>
                    <div style={{ fontSize: '0.75rem', color: '#e8e6e6' }}>
                    {(() => {
                        const now = new Date();
                        const createdAt = new Date(offer.createdAt);
                        const diffInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / 60000);
                        
                        if (diffInMinutes < 60) {
                            return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
                        } else if (diffInMinutes < 1440) {
                            const hours = Math.floor(diffInMinutes / 60);
                            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
                        } else {
                            return createdAt.toLocaleDateString('en-US', { 
                                month: '2-digit', 
                                day: '2-digit', 
                                year: 'numeric' 
                            });
                        }
                    })()}
                    </div>
                </div>
                <div style={{ color: '#fff9e6', fontSize: '1rem' , fontWeight: 'bold' }}>{offer.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#fff9e6' }}>{offer.description}</div>
            </div>
        </div>
    );
}

function OffersFeed() {
    const {offers} = useAppStore();
    const {fetchOffers} = useOfferService();
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        fetchOffers()
    }, []);

    const handleOpenModal = () => {
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const sortedOffers = offers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div style={{
            height: '100vh',
            overflowY: 'auto',
            background: 'linear-gradient(347deg in oklab, rgb(0% 92% 99% / 70%) -15% -15%, rgb(84% 0% 55% / 71%) 132% 132%)',
            fontFamily: 'Brygada 1918',
            padding: '20px',
            boxSizing: 'border-box',
            borderRadius: '10px',
            border: '1px outset #fff9e6'
        }}>
            <div style={{ 
                maxWidth: '600px',
                margin: '0 auto',
                padding: '0 20px'
            }}>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '15px', marginLeft: '10px', color: "#fff9e6" }}>Offers</h1>
                <div style={{ color: "#C71585" }}>
                    {sortedOffers.map((offer) => (
                        <OfferPost key={offer.id} offer={offer} />
                    ))}
                </div>
            </div>
            <button
                onClick={handleOpenModal}
                style={{
                    position: 'fixed',
                    bottom: '40px',
                    right: '40px',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    color: '#fff9e6',
                    fontSize: '40px',
                    backgroundColor: 'teal',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}
            >
                +
            </button>
            <OffersModal isOpen={showModal} onClose={handleCloseModal} />
        </div>
    )
}

export default OffersFeed