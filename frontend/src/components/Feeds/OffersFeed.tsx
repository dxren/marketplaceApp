import { useEffect, useState } from "react"
import { useOfferService } from "../../services/offerService"
import OffersModal from "../Modals/OffersModal";
import { useAppStore } from "../../appStore";


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

    return (
        <>
            <div style={{ backgroundColor: "#E75480" }}>
                {offers.map((offer) => (
                    <div key={offer.id}>
                        <p>{offer.title}</p>
                        <p>{offer.description}</p>
                        <p>{offer.user.displayName}</p>
                        <p>Created at: {new Date(offer.createdAt).toLocaleString()}</p>
                    </div>
                ))}
            </div>
            <button onClick={handleOpenModal}>Create New Offer</button>
            <OffersModal isOpen={showModal} onClose={handleCloseModal} />
        </>
    )
}

export default OffersFeed