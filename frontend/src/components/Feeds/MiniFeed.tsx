import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useAppStore } from "../../appStore";
import { useAskService } from "../../services/askService";
import { useOfferService } from "../../services/offerService";
import { Ask, Offer } from "../../../../shared/types";
import FavoriteButton from "../Common/FavoriteButton";
import Avatar from "../Common/Avatar";
import { getTimestampString } from "../../utils";
import styles from './MiniFeed.module.css';

type FlaggedItem = (Ask | Offer) & { type: 'ask' | 'offer' };

function PostItem({ item, isMobile }: { item: FlaggedItem; isMobile: boolean }) {
    const navigate = useNavigate();
    const { userId } = useAuth();

    const handleUserClick = () => {
        if (userId && userId === item.user.id) {
            navigate('/profile');
        } else {
            navigate(`/user/${item.user.id}`);
        }
    };

    const flagColor = item.type === 'ask' ? '#ff6bb5' : '#544bcc';
    const flagText = item.type === 'ask' ? 'SEEKING' : 'OFFERING';

    return (
        <div className={isMobile ? styles.mobilePostItem : styles.postItem}>
            <div className={styles.flag} style={{ backgroundColor: flagColor }}>{flagText}</div>
            <Avatar userId={item.user.id} avatarUrl={item.user.avatarUrl} />
            <div className={styles.content}>
                <div className={styles.userInfo}>
                    <div className={styles.userName} onClick={handleUserClick}>{item.user.displayName}</div>
                    <div className={styles.separator}>•</div>
                    <div className={styles.timestamp}>{getTimestampString(item.createdAt)}</div>
                </div>
                <Link to={`/${item.type}s/${item.id}`} className={styles.postTitle}>{item.title}</Link>
            </div>
            <div className={styles.favoriteButton}>
                <FavoriteButton itemId={item.id} itemType={item.type} />
            </div>
        </div>
    );
}

export default function MiniFeed() {
    const { asks, offers } = useAppStore();
    const { fetchAsks } = useAskService();
    const { fetchOffers } = useOfferService();

    useEffect(() => {
        fetchAsks();
        fetchOffers();
    }, []);

    const sortedItems: FlaggedItem[] = [...asks.map(ask => ({ ...ask, type: 'ask' as const })),
                                        ...offers.map(offer => ({ ...offer, type: 'offer' as const }))]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Latest Activity</h1>
            <div className={styles.desktopLayout}>
                <div>
                    {sortedItems.filter(item => item.type === 'offer').slice(0, 5).map((item) => (
                        <PostItem key={item.id} item={item} isMobile={false} />
                    ))}
                </div>
                <div>
                    {sortedItems.filter(item => item.type === 'ask').slice(0, 5).map((item) => (
                        <PostItem key={item.id} item={item} isMobile={false} />
                    ))}
                </div>
            </div>
            <div className={styles.mobileLayout}>
                {sortedItems.slice(0, 10).map((item) => (
                    <PostItem key={item.id} item={item} isMobile={true} />
                ))}
            </div>
        </div>
    );
}