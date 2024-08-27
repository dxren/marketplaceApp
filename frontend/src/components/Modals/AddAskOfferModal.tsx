import { useState } from "react"
import { useOfferService } from "../../services/offerService"
import { usePostService } from "../../services/postService"
import styles from "./styles.module.css"
import { X } from "lucide-react"

interface AddPostOfferModalProps {
    onClose: () => void
}

const AddPostOfferModal = ({ onClose }: AddPostOfferModalProps) => {
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [type, setType] = useState<"post" | "offer">("offer");
    const { fetchOffers, createOfferForCurrentUser } = useOfferService();
    const { fetchPosts, createPostForCurrentUser } = usePostService();

    const handleCreateAndCloseModal = async () => {
        try {
            if (type === "offer") {
                await createOfferForCurrentUser({ title, description });
                fetchOffers();
            } else {
                await createPostForCurrentUser({ title, description });
                fetchPosts();
            }
            console.log('x')
            onClose();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    return (
        <div className={styles.addPostOfferModalBackground}>
            <div className={styles.addPostOfferModal}>
                <div className={styles.addPostOfferModalTitle}>
                    Create Post
                </div>
                <button className={styles.addPostOfferModalCloseButton} onClick={onClose}><X size={34} /></button>
                <div className={styles.addPostOfferModalInput}>
                    <label className={styles.addPostOfferModalInputLabel}>Offering or Seeking ?</label>
                    <div className={styles.typeButtonContainer}>
                        <button
                            className={`${styles.typeButton} ${styles.offerButton} ${type === "offer" ? styles.activeTypeButton : ''}`}
                            onClick={() => setType("offer")}
                        >
                            OFFERING
                        </button>
                        <button
                            className={`${styles.typeButton} ${styles.seekButton} ${type === "post" ? styles.activeTypeButton : ''}`}
                            onClick={() => setType("post")}
                        >
                            SEEKING
                        </button>
                    </div>
                </div>
                <div className={styles.addPostOfferModalInput}>
                    <label className={styles.addPostOfferModalInputLabel}>Title</label>
                    <input
                        type="text"
                        placeholder="Title"
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.addPostOfferModalInputField}
                    />
                </div>
                <div className={styles.addPostOfferModalInput}>
                    <label className={styles.addPostOfferModalInputLabel}>Description</label>
                    <textarea
                        placeholder={`Describe your ${type}. You might include info like preferred contact method, link to setup meeting, timeframe, location and rates if applicable.`}
                        onChange={(e) => setDescription(e.target.value)}
                        className={styles.addPostOfferModalInputField}
                    />
                </div>
                <button className={styles.addPostOfferModalCreateButton} onClick={handleCreateAndCloseModal}>
                    {type === "offer" ? "Create Offer" : "Create Post"}
                </button>
            </div>
        </div>
    )
}

export default AddPostOfferModal