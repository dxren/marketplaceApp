import { useEffect, useState } from "react"
import { useOfferService } from "../../services/offerService"
import OffersModal from "../Modals/CreateOffersModal";
import { useAppStore } from "../../appStore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Offer } from "../../../../shared/types";
import PageNavigator from "./PageNavigator";
import styles from './offersStyles.module.css';
import DisplayOfferModal from "../Modals/DisplayOfferModal";
import { getTimestampString } from "../../utils";
import Avatar from "../Common/Avatar";

function PostItem({ item }: { item: Offer }) {
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


    const flagColor = '#544bcc';
    const flagText = 'OFFERING';

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
                <Avatar userId={item.user.id} avatarUrl={item.user.avatarUrl} />
                <div className={styles.content}>
                    <div className={styles.userInfo}>
                        <div className={styles.userName} onClick={handleUserClick}>
                            {item.user.displayName}
                        </div>
                        <div className={styles.separator}>•</div>
                        <div className={styles.timestamp}>
                            {getTimestampString(item.createdAt)}
                        </div>
                    </div>
                    <div className={styles.postTitle} onClick={handleTitleClick}>{item.title}</div>
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
        <div className={styles.container}>
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
            <PageNavigator page={page} setPage={setPage} maxPage={Math.ceil(offerCount / RESULTS_PER_PAGE)} />
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