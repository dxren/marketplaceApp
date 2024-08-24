import { useState } from "react"
import { useOfferService } from "../../services/offerService"
import { useAskService } from "../../services/askService"
import styles from "./styles.module.css"
import { X } from "lucide-react"

interface AddAskOfferModalProps {
    onClose: () => void
}

const AddAskOfferModal = ({ onClose }: AddAskOfferModalProps) => {
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [type, setType] = useState<"ask" | "offer">("offer");
    const { fetchOffers, createOfferForCurrentUser } = useOfferService();
    const { fetchAsks, createAskForCurrentUser } = useAskService();

    const handleCreateAndCloseModal = async () => {
        try {
            if (type === "offer") {
                await createOfferForCurrentUser({ title, description });
                fetchOffers();
            } else {
                await createAskForCurrentUser({ title, description });
                fetchAsks();
            }
            console.log('x')
            onClose();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    return (
        <div className={styles.addAskOfferModalBackground}>
            <div className={styles.addAskOfferModal}>
                <div className={styles.addAskOfferModalTitle}>
                    Create Post
                </div>
                <button className={styles.addAskOfferModalCloseButton} onClick={onClose}><X size={34} /></button>
                <div className={styles.addAskOfferModalInput}>
                    <label className={styles.addAskOfferModalInputLabel}>Offering or Seeking ?</label>
                    <div className={styles.typeButtonContainer}>
                        <button
                            className={`${styles.typeButton} ${styles.offerButton} ${type === "offer" ? styles.activeTypeButton : ''}`}
                            onClick={() => setType("offer")}
                        >
                            OFFERING
                        </button>
                        <button
                            className={`${styles.typeButton} ${styles.seekButton} ${type === "ask" ? styles.activeTypeButton : ''}`}
                            onClick={() => setType("ask")}
                        >
                            SEEKING
                        </button>
                    </div>
                </div>
                <div className={styles.addAskOfferModalInput}>
                    <label className={styles.addAskOfferModalInputLabel}>Title</label>
                    <input
                        type="text"
                        placeholder="Title"
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.addAskOfferModalInputField}
                    />
                </div>
                <div className={styles.addAskOfferModalInput}>
                    <label className={styles.addAskOfferModalInputLabel}>Description</label>
                    <textarea
                        placeholder={`Describe your ${type}. You might include info like preferred contact method, link to setup meeting, timeframe, location and rates if applicable.`}
                        onChange={(e) => setDescription(e.target.value)}
                        className={styles.addAskOfferModalInputField}
                    />
                </div>
                <button className={styles.addAskOfferModalCreateButton} onClick={handleCreateAndCloseModal}>
                    {type === "offer" ? "Create Offer" : "Create Ask"}
                </button>
            </div>
        </div>
    )
}

export default AddAskOfferModal