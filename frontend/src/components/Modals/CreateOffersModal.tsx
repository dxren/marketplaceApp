import { useState } from "react"
import { useOfferService } from "../../services/offerService"
import styles from "./styles.module.css"

interface OffersModalProps {
    onClose: () => void
}

const OffersModal = ({ onClose }: OffersModalProps) => {
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const { fetchOffers, createOfferForCurrentUser } = useOfferService();

    //add handleCreateOffer function to create a new offer
    const handleCreateOfferAndCloseModal = async () => {
        try {
            const newOffer = await createOfferForCurrentUser({ title, description });
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
        <div className={styles.offersModalBackground}>
            <div className={styles.offersModal}>
                <div className={styles.offersModalTitle}>What are you offering?</div>
                <button className={styles.offersModalCloseButton} onClick={onClose}>x</button>
                <div className={styles.offersModalInput}>
                    <label className={styles.offersModalInputLabel}>Title</label>
                    <input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)}></input>
                </div>
                <div className={styles.offersModalInput}>
                    <label className={styles.offersModalInputLabel}>Description</label>
                    <textarea placeholder="Describe your offer. You might include info like location and rates if applicable." onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>
                <button className={styles.offersModalCreateButton} onClick={handleCreateOfferAndCloseModal}>Create Offer</button>
            </div>
        </div>
    )
}

export default OffersModal