import { useEffect, useState } from "react"
import { useOfferService } from "../../services/offerService"
import OffersModal from "../Modals/CreateOffersModal";
import { useAppStore } from "../../appStore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Offer } from "../../../../shared/types";
import PageNavigator from "./PageNavigator";
import offerStyles from './offersStyles.module.css';
import styles from './styles.module.css';
import DisplayOfferModal from "../Modals/DisplayOfferModal";
import FavoriteButton from "../Common/FavoriteButton";
import { getTimestampString } from "../../utils";
import Avatar from "../Common/Avatar";
import { useIsMobile } from "../../hooks/useIsMobile";
import { Search } from "lucide-react";

function PostItem({ item }: { item: Offer }) { 
    const navigate = useNavigate();
    const { userId } = useAuth();
    const [showModal, setShowModal] = useState(false)
    const isMobile = useIsMobile();

    const handlePostClick = () => {
        if (isMobile) {
            navigate(`/offers/${item.id}`);
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

    const flagColor = '#544bcc';
    const flagText = 'OFFERING';

    return (
        <>
            <div className={offerStyles.postItem} onClick={handlePostClick}>
                <div
                    className={offerStyles.flag}
                    style={{
                        backgroundColor: flagColor,
                        background: `linear-gradient(135deg, ${flagColor}, ${flagColor}cc)`,
                        border: `1px solid ${flagColor}33`,
                    }}
                >
                    {flagText}
                </div>
                <Avatar userId={item.user.id} avatarUrl={item.user.avatarUrl} />
                <div className={offerStyles.content}>
                    <div className={offerStyles.userInfo}>
                        <div className={offerStyles.userName} onClick={(e) => handleUserClick(e)}>
                            {item.user.displayName}
                        </div>
                        <div className={offerStyles.separator}>•</div>
                        <div className={offerStyles.timestamp}>
                            {getTimestampString(item.createdAt)}
                        </div>
                    </div>
                    <div className={offerStyles.postTitle} >{item.title}</div>
                    <div className={offerStyles.description}>{item.description}</div>
                </div>
                <div className={offerStyles.layoutFavoriteButton}>
                    <FavoriteButton itemId={item.id} itemType="offer" />
                </div>
            </div>
            <div className={offerStyles.mobilePostItem} onClick={handlePostClick}>
                <div
                    className={offerStyles.flag}
                    style={{
                        backgroundColor: flagColor,
                        background: `linear-gradient(135deg, ${flagColor}, ${flagColor}cc)`,
                        border: `1px solid ${flagColor}33`,
                    }}
                >
                    {flagText}
                </div>
                <div className={offerStyles.mobileUserInfo}>
                    <Avatar userId={userId} />
                    <div>
                        <div className={offerStyles.userName} onClick={(e) => handleUserClick(e)}>
                            {item.user.displayName}
                        </div>
                        <div className={offerStyles.timestamp}>
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
                <div className={offerStyles.postTitle} >{item.title}</div>
                <div className={offerStyles.description}>{item.description}</div>
            </div>
            {!isMobile && showModal && <DisplayOfferModal id={item.id} onClose={handleCloseModal} />}
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

    const fetchWithSearch = () => {
        const searchString = searchTerm.trim();
        fetchOffers({searchString});
    }

    return (
        <div className={offerStyles.container} >
            <div className={offerStyles.header}>
                <h1 className={offerStyles.title}>Offers</h1>
                <div className={styles.searchBar}>
                    <input
                        type="text"
                        placeholder="Search offers"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={e => {if (e.key === 'Enter') fetchWithSearch()}}
                        className={offerStyles.searchInput}
                    />
                    <button className={styles.searchButton} onClick={fetchWithSearch}><Search color='white' /></button>
                </div>
            </div>
            <div className={offerStyles.offersList}>
                {offers.length > 0 ?
                    offers.map((offer: Offer) =>
                        <PostItem key={offer.id} item={offer} />)
                    : (
                        <p className={offerStyles.noOffersFound}>No offers found</p>
                    )}
            </div>
            {offers.length > 0 && (
                <PageNavigator page={page} setPage={setPage} maxPage={Math.ceil(offerCount / RESULTS_PER_PAGE)} />
            )}
            {isSignedIn && (
                <button
                    onClick={handleOpenModal}
                    className={offerStyles.addButton}
                >
                    +
                </button>
            )}
            {showModal && <OffersModal onClose={handleCloseModal} />}
        </div>
    )
}

export default OffersFeed