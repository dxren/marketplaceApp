import { useEffect, useState } from "react"
import styles from './styles.module.css';
import { useUserService } from "../../services/userService";
import Avatar from "../Common/Avatar";
import UserDetails from "./UserDetails";
import Asks from "./Asks";
import Offers from "./Offers";
import { useAppStore } from "../../appStore";
import { FeedToggle, FeedType } from "./FeedToggle";
import FavoriteAsksFeed from "./FavoriteAsksFeed";
import FavoriteOffersFeed from "./FavoriteOffersFeed";
import { useIsMobile } from '../../hooks/useIsMobile';
import AddAskOfferModal from "../Modals/AddAskOfferModal";
import { useAuth } from "@clerk/clerk-react";

export enum Mode { View, Edit };

interface UserInfoProps {
    userId: string | null;  // When null, assume currently logged-in user
}

function UserInfo(props: UserInfoProps) {
    const { userId } = props;
    const { currentUser, fetchedUser } = useAppStore();
    const { fetchCurrentUser, fetchUser } = useUserService();
    const { isSignedIn } = useAuth();
    const [showModal, setShowModal] = useState(false)
    const [activeFeed, setActiveFeed] = useState<FeedType>(FeedType.Offers)
    const isMobile = useIsMobile();

    const isOwnProfile = userId === null;

    const user = isOwnProfile ? currentUser : fetchedUser;

    useEffect(() => {
        isOwnProfile
            ? fetchCurrentUser()
            : fetchUser(userId);
    }, [userId]);

    const handleFeedToggle = (selectedFeed: FeedType) => {
        setActiveFeed(selectedFeed)
    }

    const getAvailableFeedTypes = (): FeedType[] => {
        if (isOwnProfile) {
            return [FeedType.Asks, FeedType.Offers, FeedType.FavoriteAsks, FeedType.FavoriteOffers];
        } else {
            return [FeedType.Asks, FeedType.Offers];
        }
    }

    const renderActiveFeed = () => {
        switch (activeFeed) {
            case FeedType.Offers:
                return <Offers isOwnProfile={isOwnProfile} />;
            case FeedType.Asks:
                return <Asks isOwnProfile={isOwnProfile} />;
            case FeedType.FavoriteOffers:
                return isOwnProfile ? <FavoriteOffersFeed /> : null;
            case FeedType.FavoriteAsks:
                return isOwnProfile ? <FavoriteAsksFeed /> : null;
            default:
                return null;
        }
    }


    const handleOpenModal = () => {
        if (isSignedIn) {
            setShowModal(true)
        }
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    return (
        <>
            <div className={styles.userInfo}>
                <div className={styles.userInfoHeader}>

                    <div className={styles.userInfoAvatar}>
                        <Avatar avatarUrl={user?.avatarUrl} userId={userId} width={isMobile ? '100px' : '200px'} />
                    </div>
                    <UserDetails isOwnProfile={isOwnProfile} />
                </div>
                <FeedToggle activeFeed={activeFeed} onToggle={handleFeedToggle} availableFeedTypes={getAvailableFeedTypes()} />
                {renderActiveFeed()}
            </div>
            {
                isSignedIn && (
                    <button
                        onClick={handleOpenModal}
                        className={styles.addButton}
                    >
                        +
                    </button>
                )
            }
            {showModal && <AddAskOfferModal onClose={handleCloseModal} />}
        </>
    )
}

export default UserInfo;