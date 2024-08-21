import { useEffect, useState } from "react"
import { useAskService } from "../../services/askService"
import AsksModal from "../Modals/CreateAsksModal";
import { useAppStore } from "../../appStore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Ask } from "../../../../shared/types";
import { DEFAULT_AVATAR_URL } from "../../constants";
import styles from './asksStyles.module.css';
import PageNavigator from "./PageNavigator";
import DisplayAskModal from "../Modals/DisplayAskModal";

function PostItem({ item }: { item: Ask }) {
    const navigate = useNavigate();
    const { userId } = useAuth();
    const [showModal, setShowModal] = useState(false)

    const handleUserClick = () => {
        if (userId && userId === item.user.id) {
            navigate('/profile');
        } else {
            navigate(`/user/${item.user.id}`);
        }
    };

    const handleTitleClick = () => {
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const flagColor = '#ff6bb5';
    const flagText = 'SEEKING';

    return (
        <>
            <div className={styles.postItem}>
                <div
                    className={styles.flag}
                    style={{
                        backgroundColor: flagColor,
                        background: `linear-gradient(135deg, ${flagColor}, ${flagColor}cc)`,
                        border: `1px solid ${flagColor}33`,
                    }}
                >
                    {flagText}
                </div>
                <img
                    className={styles.avatar}
                    onClick={handleUserClick}
                    src={item.user?.avatarUrl || DEFAULT_AVATAR_URL}
                    alt={item.user?.displayName || 'User'}
                />
                <div className={styles.content}>
                    <div className={styles.userInfo}>
                        <div className={styles.userName} onClick={handleUserClick}>
                            {item.user.displayName}
                        </div>
                        <div className={styles.separator}>•</div>
                        <div className={styles.timestamp}>
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
                    <div className={styles.postTitle} onClick={handleTitleClick}>{item.title}</div>
                    <div className={styles.description}>{item.description}</div>
                </div>
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

    const filterAsks = (asks: Ask[]) => {
        return asks.filter((ask: Ask) =>
            ask.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ask.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }

    const filteredAsks = filterAsks(asks)

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Asks</h1>
                <input
                    type="text"
                    placeholder="Search asks"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>
            <div className={styles.asksList}>
                {filteredAsks.length > 0 ?
                    filteredAsks.map((ask: Ask) =>
                        <PostItem key={ask.id} item={ask} />)
                    : (
                        <p className={styles.noAsksFound}>No asks found</p>
                    )}
            </div>
            <PageNavigator page={page} setPage={setPage} maxPage={Math.ceil(askCount / RESULTS_PER_PAGE)} />
            {isSignedIn && (
                <button
                    onClick={handleOpenModal}
                    className={styles.addButton}
                >
                    +
                </button>
            )}
            {showModal && <AsksModal onClose={handleCloseModal} />}
        </div>
    )
}

export default AsksFeed