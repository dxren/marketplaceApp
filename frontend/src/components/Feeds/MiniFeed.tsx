import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useAppStore } from "../../appStore";
import { Post } from "../../../../shared/apiTypes";
import FavoriteButton from "../Common/FavoriteButton";
import Avatar from "../Common/Avatar";
import { getTimestampString } from "../../utils";
import styles from './MiniFeed.module.css';
import { useIsMobile } from "../../hooks/useIsMobile";
import DisplayPostModal from "../Modals/DisplayPostModal";
import { useUserService } from "../../services/userService";
import AddPostModal from "../Modals/AddPostModal";
import { useState } from "react";

type PostItemProps = {
    post: Post;
}
function PostItem(props: PostItemProps) {
    const navigate = useNavigate();
    const { userId } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const isMobile = useIsMobile();
    const { getUser } = useUserService();

    const item = props.post;
    const user = getUser(item.userId);

    const handlePostClick = () => {
        if (isMobile) {
            navigate(`/${item.type}s/${item.id}`);
        } else {
            setShowModal(true);
        }
    };

    const handleUserClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        if (userId && userId === item.userId) {
            navigate('/profile');
        } else {
            navigate(`/user/${item.userId}`);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleFavoriteClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
    };

    const flagColor = item.type === 'post' ? '#ff6bb5' : '#544bcc';
    const flagText = item.type === 'post' ? 'SEEKING' : 'OFFERING';

    return (
        <>
            <div className={isMobile ? styles.mobilePostItem : styles.postItem} onClick={handlePostClick}>
                <div className={styles.flag} style={{ backgroundColor: flagColor }}>{flagText}</div>
                <Avatar userId={user?.id} avatarUrl={user?.avatarUrl} />
                <div className={styles.content}>
                    <div className={styles.userInfo}>
                        <div className={styles.userName} onClick={handleUserClick}>{user?.displayName}</div>
                        <div className={styles.separator}>•</div>
                        <div className={styles.timestamp}>{getTimestampString(item.createdAt)}</div>
                    </div>
                    <div className={styles.postTitle}>{item.title}</div>
                </div>
                <div className={styles.favoriteButton} onClick={handleFavoriteClick}>
                    <FavoriteButton post={item} />
                </div>
            </div>
            {showModal && <DisplayPostModal id={item.id} onClose={handleCloseModal} />}
        </>
    );
}

export default function MiniFeed() {
    const { posts } = useAppStore();
    const { isSignedIn } = useAuth();
    const [showModal, setShowModal] = useState(false)

    const handleOpenModal = () => {
        if (isSignedIn) {
            setShowModal(true)
        }
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const sortedItems: Post[] = posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return (
        <div className={styles.container}>
            <div className={styles.title}>Latest Activity</div>
            <div className={styles.desktopLayout}>
                <div>
                    {sortedItems.filter(item => item.type === 'offer').slice(0, 5).map((item) => (
                        <PostItem key={item.id} post={item} />
                    ))}
                </div>
                <div>
                    {sortedItems.filter(item => item.type === 'post').slice(0, 5).map((item) => (
                        <PostItem key={item.id} post={item} />
                    ))}
                </div>
            </div>
            <div className={styles.mobileLayout}>
                {sortedItems.slice(0, 10).map((item) => (
                    <PostItem key={item.id} post={item} />
                ))}
            </div>
            {isSignedIn && (
                <button
                    onClick={handleOpenModal}
                    className={styles.addButton}
                >
                    +
                </button>
            )}
            {showModal && <AddPostModal onClose={handleCloseModal} />}
        </div>
    );
}