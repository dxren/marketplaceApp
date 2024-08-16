import { useEffect, useState } from "react"
import { useOfferService } from "../../services/offerService"
import OffersModal from "../Modals/OffersModal";

import { useAppStore } from "../../appStore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";


function OfferPost({ offer }: { offer: Offer }) {
    const navigate = useNavigate();
    const { userId } = useAuth();

    const handleUserClick = () => {
        console.log(offer.user.id)
        if (userId && userId === offer.user.id) {
            navigate('/profile')
        } else {
            navigate(`/user/${offer.user.id}`)
        }
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            border: '1px solid #fff9e6',
            padding: '10px 20px',
            gap: '20px',
            marginBottom: '10px',
            borderRadius: '4px',
            color: '#fff9e6',
        }}>

            <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '100%',
                backgroundColor: '#fff9e6',
                flexShrink: 0,
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div onClick={handleUserClick} style={{
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    color: '#3830a6'  // Changed to a pink color for visibility
                }}>{offer.user.displayName}</div>
                <div style={{ color: '#3830a6' }}>{offer.title}</div> {/* Pink color for the title */}
                <div>{offer.description}</div>
                <div style={{ fontSize: '12px' }}>posted {new Date(offer.createdAt).toLocaleString()}</div>
            </div>
        </div>
    )
}

function OffersFeed() {
    const {offers} = useAppStore();
    const {fetchOffers} = useOfferService();
    const [showModal, setShowModal] = useState(false)

    //useEffect to fetch the feed of offers on page load
    useEffect(() => {
        fetchOffers()
    }, []);

    //add a create Offer button that will display the offersModal component on click
    const handleOpenModal = () => {
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    //beatufyl pink color "#E75480"

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
            <div>
                <h1 style={{ color: "#3830a6", textShadow: '0 0 6px #fff9e6' }}>Offers</h1>
            </div>
            <div style={{ color: "#3830a6" }}>
                {offers.map((offer) => (
                    <OfferPost key={offer.id} offer={offer} />
                ))}
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
            <OffersModal fetchOffers={fetchOffers} isOpen={showModal} onClose={handleCloseModal} />
        </div>
    )
}

export default OffersFeed