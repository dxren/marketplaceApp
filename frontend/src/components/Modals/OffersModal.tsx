import { useState } from "react"
import { useOfferService } from "../../services/offerService"

interface OffersModalProps {
    isOpen: boolean
    onClose: () => void,
    fetchOffers: () => void
}

const OffersModal = ({ isOpen, onClose, fetchOffers }: OffersModalProps) => {
    if (!isOpen) return null
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const offerService = useOfferService();

    //add handleCreateOffer function to create a new offer
    const handleCreateOfferAndCloseModal = async () => {
        try {
            const newOffer = await offerService.createOfferForCurrentUser({title, description});
            fetchOffers()
            console.log(newOffer)
            onClose()
        }
        catch (error) {
            console.error(error)
            throw error
        }
    }


    return (
        <div style={{ backgroundColor: 'darkgrey', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.9 }}>
            <div style={{ color: 'black', backgroundColor: 'white', width: '500px', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 1, margin: 'auto', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <h2 style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)' }}>What's your offer?</h2>
                <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px' }}>x</button>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingTop: '2rem' }}>
                    <label style={{ margin: '10px' }}>Title</label>
                    <input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)}></input>
                    <label style={{ margin: '10px' }}>Description</label>
                    <input type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)}></input>
                    <button onClick={handleCreateOfferAndCloseModal}>Create Offer</button>
                </div>
            </div>
        </div>
    )
}

export default OffersModal