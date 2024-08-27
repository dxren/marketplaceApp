import { useState } from "react"
import { usePostService } from "../../services/postService"
import styles from "./styles.module.css"
interface PostsModalProps {
    onClose: () => void
}

const PostsModal = ({ onClose }: PostsModalProps) => {
    const { fetchPosts } = usePostService();
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const { createPostForCurrentUser } = usePostService();

    //add handleCreatePost function to create a new post
    const handleCreatePostAndCloseModal = async () => {
        try {
            await createPostForCurrentUser({ title, description });
            fetchPosts()
            onClose()
        }
        catch (error) {
            console.error(error)
            throw error
        }
    }

    return (
        <div className={styles.postModalBackground}>
            <div className={styles.postModal}>
                <div className={styles.postModalTitle}>What are you seeking?</div>
                <button className={styles.postModalCloseButton} onClick={onClose} >x</button>
                <div className={styles.postModalInput}>
                    <label className={styles.postModalInputLabel}>Title</label>
                    <input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)}></input>
                </div>
                <div className={styles.postModalInput}>
                    <label className={styles.postModalInputLabel}>Description</label>
                    {/* <input type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)}></input> */}
                    <textarea placeholder="Describe your post. You might include info like preferred contact method, time frames and budget, if applicable." onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>
                <button className={styles.postModalCreateButton} onClick={handleCreatePostAndCloseModal}>Create Post</button>
            </div>
        </div>
    )
}

export default PostsModal