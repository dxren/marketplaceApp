import { useState } from "react"
import { useAskService } from "../../services/askService"
import styles from "./styles.module.css"
interface AsksModalProps {
    onClose: () => void
}

const AsksModal = ({ onClose }: AsksModalProps) => {
    const { fetchAsks } = useAskService();
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const { createAskForCurrentUser } = useAskService();

    //add handleCreateAsk function to create a new ask
    const handleCreateAskAndCloseModal = async () => {
        try {
            await createAskForCurrentUser({ title, description });
            fetchAsks()
            onClose()
        }
        catch (error) {
            console.error(error)
            throw error
        }
    }

    return (
        <div className={styles.askModalBackground}>
            <div className={styles.askModal}>
                <div className={styles.askModalTitle}>What are you seeking?</div>
                <button className={styles.askModalCloseButton} onClick={onClose} >x</button>
                <div className={styles.askModalInput}>
                    <label className={styles.askModalInputLabel}>Title</label>
                    <input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)}></input>
                </div>
                <div className={styles.askModalInput}>
                    <label className={styles.askModalInputLabel}>Description</label>
                    {/* <input type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)}></input> */}
                    <textarea placeholder="Describe your ask. You might include info like time frames and budget, if applicable." onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>
                <button className={styles.askModalCreateButton} onClick={handleCreateAskAndCloseModal}>Create Ask</button>
            </div>
        </div>
    )
}

export default AsksModal