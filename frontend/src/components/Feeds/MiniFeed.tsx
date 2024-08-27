import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useAppStore } from "../../appStore";
import { usePostService } from "../../services/postService";
import { useOfferService } from "../../services/offerService";
import { Post, Offer } from "../../../../shared/types";
import FavoriteButton from "../Common/FavoriteButton";
import Avatar from "../Common/Avatar";
import { getTimestampString } from "../../utils";
import styles from './MiniFeed.module.css';
import { useIsMobile } from "../../hooks/useIsMobile";
import DisplayPostModal from "../Modals/DisplayPostModal";
import DisplayOfferModal from "../Modals/DisplayOfferModal";
import AddPostOfferModal from "../Modals/AddPostOfferModal";

type FlaggedItem = (Post | Offer) & { type: 'post' | 'offer' };

function PostItem({ item }: { item: FlaggedItem }) {
    const navigate = useNavigate();
    const { userId } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const isMobile = useIsMobile();


    const handlePostClick = () => {
        if (isMobile) {
            navigate(`/${item.type}s/${item.id}`);
        } else {
            setShowModal(true);
        }
    };

    const handleUserClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        if (userId && userId === item.user.id) {
            navigate('/profile');
        } else {
            navigate(`/user/${item.user.id}`);
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
                <Avatar userId={item.user.id} avatarUrl={item.user.avatarUrl} />
                <div className={styles.content}>
                    <div className={styles.userInfo}>
                        <div className={styles.userName} onClick={handleUserClick}>{item.user.displayName}</div>
                        <div className={styles.separator}>•</div>
                        <div className={styles.timestamp}>{getTimestampString(item.createdAt)}</div>
                    </div>
                    <div className={styles.postTitle}>{item.title}</div>
                </div>
                <div className={styles.favoriteButton} onClick={handleFavoriteClick}>
                    <FavoriteButton itemId={item.id} itemType={item.type} />
                </div>
            </div>
            {showModal && item.type === 'post' && <DisplayPostModal id={item.id} onClose={handleCloseModal} />}
            {showModal && item.type === 'offer' && <DisplayOfferModal id={item.id} onClose={handleCloseModal} />}
        </>
    );
}

export default function MiniFeed() {
    const { posts, offers } = useAppStore();
    const { fetchPosts } = usePostService();
    const { fetchOffers } = useOfferService();
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

    useEffect(() => {
        fetchPosts();
        fetchOffers();
    }, []);

    const sortedItems: FlaggedItem[] = [...posts.map(post => ({ ...post, type: 'post' as const })),
    ...offers.map(offer => ({ ...offer, type: 'offer' as const }))]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className={styles.container}>
            <div className={styles.title}>Latest Activity</div>
            <div className={styles.desktopLayout}>
                <div>
                    {sortedItems.filter(item => item.type === 'offer').slice(0, 5).map((item) => (
                        <PostItem key={item.id} item={item} />
                    ))}
                </div>
                <div>
                    {sortedItems.filter(item => item.type === 'post').slice(0, 5).map((item) => (
                        <PostItem key={item.id} item={item} />
                    ))}
                </div>
            </div>
            <div className={styles.mobileLayout}>
                {sortedItems.slice(0, 10).map((item) => (
                    <PostItem key={item.id} item={item} />
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
            {showModal && <AddPostOfferModal onClose={handleCloseModal} />}
        </div>
    );
}