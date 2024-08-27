import { useState } from 'react';
import { useAppStore } from '../../appStore';
import { usePostService } from '../../services/postService';
import styles from './styles.module.css'
import AddPostOfferModal from '../Modals/AddPostOfferModal';
import Item, { EditablePostOffer } from './Item';

type PostsProps = {
    isOwnProfile: boolean;
}

function Posts(props: PostsProps) {
    const { currentUser, fetchedUser } = useAppStore();
    const { updatePostForCurrentUser, deletePostForCurrentUser } = usePostService();
    const [showPostModal, setShowPostModal] = useState<boolean>(false);

    const { isOwnProfile } = props;

    const posts: EditablePostOffer[] = isOwnProfile ? (currentUser?.posts ?? []) : (fetchedUser?.posts ?? []);

    const hasPosts = posts.length > 0;

    if (!isOwnProfile && !hasPosts) {
        return (
            <div className={styles.noContentMessage}>
                This user hasn't added any posts yet!
            </div>
        );
    }

    return (
        <div className={styles.postsContainer}>
            {(isOwnProfile || hasPosts) && (
                <div className={styles.postSection}>
                    <div className={styles.postHeader}>
                        <div className={styles.postTitle}>
                        </div>
                    </div>
                    <div className={styles.postList}>
                        {posts.map((post, i) => (
                            <Item
                                key={post.id ?? `post_${i}`}
                                item={post}
                                onChange={item => post.id && updatePostForCurrentUser(post.id, item)}
                                onDelete={() => post.id && deletePostForCurrentUser(post.id)}
                                canEdit={isOwnProfile}
                            />
                        ))}
                    </div>
                </div>
            )}
            {showPostModal && <AddPostOfferModal onClose={() => setShowPostModal(false)} />}
        </div>
    )
}

export default Posts;