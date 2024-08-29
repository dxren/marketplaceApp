import { useState } from 'react';
import { useAppStore } from '../../appStore';
import { usePostService } from '../../services/postService';
import styles from './styles.module.css'
import AddPostOfferModal from '../Modals/AddPostModal';
import Item from './Item';
import { User } from '../../../../shared/apiTypes';

type PostsProps = {
    user: User | null;
    isOwnProfile: boolean;
}

function Posts(props: PostsProps) {
    const { posts } = useAppStore();
    const { updatePostForCurrentUser, deletePostForCurrentUser } = usePostService();
    const [showPostModal, setShowPostModal] = useState<boolean>(false);

    const { isOwnProfile } = props;

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