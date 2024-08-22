import { useEffect, useState } from "react"
import { useOfferService } from "../../services/offerService"
import OffersModal from "../Modals/CreateOffersModal";
import { useAppStore } from "../../appStore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Offer } from "../../../../shared/types";
import { DEFAULT_AVATAR_URL } from "../../constants";
import PageNavigator from "./PageNavigator";
import styles from './offersStyles.module.css';
import DisplayOfferModal from "../Modals/DisplayOfferModal";

function PostItem({ item }: { item: Offer }) {
    const navigate = useNavigate();
    const { userId } = useAuth();
    const [showModal, setShowModal] = useState(false)

    const handlePostClick = () => {
        setShowModal(true);
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

    const flagColor = '#544bcc';
    const flagText = 'OFFERING';

    return (
        <>
            <div className={styles.postItem} onClick={handlePostClick}>
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
                    onClick={(e) => handleUserClick(e)}
                    src={item.user?.avatarUrl || DEFAULT_AVATAR_URL}
                    alt={item.user?.displayName || 'User'}
                />
                <div className={styles.content}>
                    <div className={styles.userInfo}>
                        <div className={styles.userName} onClick={(e) => handleUserClick(e)}>
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
                    <div className={styles.postTitle} >{item.title}</div>
                    <div className={styles.description}>{item.description}</div>
                </div>
            </div>
            {showModal && <DisplayOfferModal id={item.id} onClose={handleCloseModal} />}
        </>
    );
}

function OffersFeed() {
    const { offers, offerCount } = useAppStore();
    const { fetchOffers } = useOfferService();
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false)
    const { isSignedIn } = useAuth();
    const [page, setPage] = useState<number>(1);
    const RESULTS_PER_PAGE = 10;

    useEffect(() => {
        fetchOffers({ limit: RESULTS_PER_PAGE, offset: (page - 1) * RESULTS_PER_PAGE });
    }, [page]);

    const handleOpenModal = () => {
        if (isSignedIn) {
            setShowModal(true)
        }
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const filterOffers = (offers: Offer[]) => {
        return offers.filter((offer: Offer) =>
            offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            offer.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }

    const filteredOffers = filterOffers(offers)

    return (
        <div className={styles.container} >
            <div className={styles.header}>
                <h1 className={styles.title}>Offers</h1>
                <input
                    type="text"
                    placeholder="Search offers"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>
            <div className={styles.offersList}>
                {filteredOffers.length > 0 ?
                    filteredOffers.map((offer: Offer) =>
                        <PostItem key={offer.id} item={offer} />)
                    : (
                        <p className={styles.noOffersFound}>No offers found</p>
                    )}
            </div>
            {offers.length > 0 && (
                <PageNavigator page={page} setPage={setPage} maxPage={Math.ceil(offerCount / RESULTS_PER_PAGE)} />
            )}
            {isSignedIn && (
                <button
                    onClick={handleOpenModal}
                    className={styles.addButton}
                >
                    +
                </button>
            )}
            {showModal && <OffersModal onClose={handleCloseModal} />}
        </div>
    )
}

export default OffersFeed