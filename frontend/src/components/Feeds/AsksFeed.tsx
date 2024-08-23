import { useEffect, useState } from "react"
import { useAskService } from "../../services/askService"
import AddAskOfferModal from "../Modals/AddAskOfferModal";
import { useAppStore } from "../../appStore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Ask } from "../../../../shared/types";

import styles from './styles.module.css';
import askStyles from './asksStyles.module.css';
import PageNavigator from "./PageNavigator";
import DisplayAskModal from "../Modals/DisplayAskModal";
import FavoriteButton from "../Common/FavoriteButton";
import { getTimestampString } from "../../utils";
import Avatar from "../Common/Avatar";
import { useIsMobile } from "../../hooks/useIsMobile";
import { Search } from "lucide-react";

function PostItem({ item }: { item: Ask }) { 
    const navigate = useNavigate();
    const { userId } = useAuth();
    const [showModal, setShowModal] = useState(false)
    const isMobile = useIsMobile();

    const handlePostClick = () => {
        if (isMobile) {
            navigate(`/asks/${item.id}`);
        } else {
            setShowModal(true);
        }
    }

    const handleUserClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        if (userId && userId === item.user.id) {
            navigate('/profile');
        } else {
            navigate(`/user/${item.user.id}`);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const flagColor = '#ff6bb5';
    const flagText = 'SEEKING';

    return (
        <>
            <div className={askStyles.postItem} onClick={handlePostClick}>
                <div
                    className={askStyles.flag}
                    style={{
                        backgroundColor: flagColor,
                        background: `linear-gradient(135deg, ${flagColor}, ${flagColor}cc)`,
                        border: `1px solid ${flagColor}33`,
                    }}
                >
                    {flagText}
                </div>

                <Avatar userId={item.user.id} avatarUrl={item.user.avatarUrl} />
                <div className={askStyles.content}>
                    <div className={askStyles.userInfo}>
                        <div className={askStyles.userName} onClick={(e) => handleUserClick(e)}>
                            {item.user.displayName}
                        </div>
                        <div className={askStyles.separator}>•</div>
                        <div className={askStyles.timestamp}>
                            {getTimestampString(item.createdAt)}
                        </div>
                    </div>
                    <div className={askStyles.postTitle} >{item.title}</div>
                    <div className={askStyles.description}>{item.description}</div>
                </div>
                <div className={askStyles.layoutFavoriteButton}>
                    <FavoriteButton itemId={item.id} itemType="ask" />
                </div>
            </div>
            <div className={askStyles.mobilePostItem} onClick={handlePostClick}>
                <div
                    className={askStyles.flag}
                    style={{
                        backgroundColor: flagColor,
                        background: `linear-gradient(135deg, ${flagColor}, ${flagColor}cc)`,
                        border: `1px solid ${flagColor}33`,
                    }}
                >
                    {flagText}
                </div>
                <div className={askStyles.mobileUserInfo}>
                    <Avatar userId={userId} />
                    <div>
                        <div className={askStyles.userName} onClick={(e) => handleUserClick(e)}>
                            {item.user.displayName}
                        </div>
                        <div className={askStyles.timestamp}>
                            {(() => {
                                const now = new Date();
                                const createdAt = new Date(item.createdAt);
                                const diffInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / 60000);

                                if (diffInMinutes < 60) {
                                    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
                                } else if (diffInMinutes < 1440) {
                                    const hours = Math.floor(diffInMinutes / 60);
                                    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
                                } else {
                                    return createdAt.toLocaleDateString('en-US', {
                                        month: '2-digit',
                                        day: '2-digit',
                                        year: 'numeric'
                                    });
                                }
                            })()}
                        </div>
                    </div>
                </div>
                <div className={askStyles.postTitle} >{item.title}</div>
                <div className={askStyles.description}>{item.description}</div>
            </div>
            {showModal && <DisplayAskModal id={item.id} onClose={handleCloseModal} />}
        </>
    );
}

function AsksFeed() {
    const { asks, askCount } = useAppStore();
    const { fetchAsks } = useAskService();
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false)
    const { isSignedIn } = useAuth();
    const [page, setPage] = useState<number>(1);
    const RESULTS_PER_PAGE = 10;

    useEffect(() => {
        fetchAsks({ limit: RESULTS_PER_PAGE, offset: (page - 1) * RESULTS_PER_PAGE });
    }, [page]);

    const handleOpenModal = () => {
        if (isSignedIn) {
            setShowModal(true)
        }
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const fetchWithSearch = () => {
        const searchString = searchTerm.trim();
        fetchAsks({searchString});
    }

    return (
        <div className={askStyles.container} >
            <div className={askStyles.header}>
                <h1 className={askStyles.title}>Asks</h1>
                <div className={styles.searchBar}>
                    <input
                        type="text"
                        placeholder="Search asks"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={e => {if (e.key === 'Enter') fetchWithSearch()}}
                        className={askStyles.searchInput}
                    />
                    <button className={styles.searchButton} onClick={fetchWithSearch}><Search color='white' /></button>
                </div>
            </div>
            <div className={askStyles.asksList}>
                {asks.length > 0 ?
                    asks.map((ask: Ask) =>
                        <PostItem key={ask.id} item={ask} />)
                    : (
                        <p className={askStyles.noAsksFound}>No asks found</p>
                    )}
            </div>
            {asks.length > 0 && (
                <PageNavigator page={page} setPage={setPage} maxPage={Math.ceil(askCount / RESULTS_PER_PAGE)} />
            )}
            {isSignedIn && (
                <button
                    onClick={handleOpenModal}
                    className={askStyles.addButton}
                >
                    +
                </button>
            )}
            {showModal && <AddAskOfferModal onClose={handleCloseModal} />}
        </div>
    )
}

export default AsksFeed