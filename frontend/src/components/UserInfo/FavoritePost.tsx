import { Post } from "../../../../shared/apiTypes";
import { useUserService } from "../../services/userService";

import styles from './styles.module.css';

type FavoritePostProps = {
    post: Post;
}
const FavoritePost = (props: FavoritePostProps) => {
    const {getUser} = useUserService();
    const {post} = props;
    const user = getUser(post.userId);

    return (
        <div
            key={post.id}
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '10px 15px',
                gap: '18px',
                border: '1px solid #fff9e6',
                marginBottom: '10px',
                borderRadius: '5px',
                color: '#fff9e6',
                position: 'relative',
                background: 'linear-gradient(to right, rgba(84, 0, 55, 0.2), rgba(199, 21, 133, 0.2))',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                fontSize: '1.1rem',
            }}
        >
            <div style={{ display: 'flex', gap: '5px', flex: 1, justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

                    <div>
                        <p className={styles.titleText}>{post.title}</p>
                        <p className={styles.descriptionText}>{post.description}</p>
                        <p><a href={`user/${post.userId}`} className={styles.userLink}>{user?.displayName ?? '...'}</a></p>
                        <div className={styles.timestamp}>
                            {(() => {
                                const now = new Date();
                                const createdAt = new Date(post.createdAt);
                                const diffInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / 60000);

                                if (diffInMinutes < 60) {
                                    return "Posted: " + `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
                                } else if (diffInMinutes < 1440) {
                                    const hours = Math.floor(diffInMinutes / 60);
                                    return "Posted: " + `${hours} hour${hours !== 1 ? 's' : ''} ago`;
                                } else {
                                    return "Posted: " + createdAt.toLocaleDateString('en-US', {
                                        month: '2-digit',
                                        day: '2-digit',
                                        year: 'numeric'
                                    });
                                }
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FavoritePost;