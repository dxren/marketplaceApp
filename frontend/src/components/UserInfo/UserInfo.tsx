
import styles from './styles.module.css';
import Avatar from "../Common/Avatar";
import UserDetails from "./UserDetails";
import Posts from "./Posts";
import { useAppStore } from "../../appStore";
import { FeedToggle, FeedType } from "./FeedToggle";
import FavoritePostsFeed from "./FavoritePostsFeed";
import { useIsMobile } from '../../hooks/useIsMobile';
import AddPostOfferModal from "../Modals/AddPostModal";
import { useAuth } from "@clerk/clerk-react";
import { useState } from 'react';
import { useUserService } from '../../services/userService';

export enum Mode { View, Edit };

interface UserInfoProps {
    userId: string | null  // When null, assume currently logged-in user
}

function UserInfo(props: UserInfoProps) {
    const { currentUser } = useAppStore();
    const { isSignedIn } = useAuth();
    const [showModal, setShowModal] = useState(false)
    const [activeFeed, setActiveFeed] = useState<FeedType>(FeedType.Posts)
    const isMobile = useIsMobile();
    const { getUser } = useUserService();

    const user = props.userId ? getUser(props.userId) : currentUser;
    const isOwnProfile = user === null;

    const handleFeedToggle = (selectedFeed: FeedType) => {
        setActiveFeed(selectedFeed)
    }

    const getAvailableFeedTypes = (): FeedType[] => {
        if (isOwnProfile) {
            return [FeedType.Posts, FeedType.FavoritePosts];
        } else {
            return [FeedType.Posts];
        }
    }

    const renderActiveFeed = () => {
        switch (activeFeed) {
            case FeedType.Posts:
                return <Posts isOwnProfile={isOwnProfile} user={user} />;
            case FeedType.FavoritePosts:
                return isOwnProfile ? <FavoritePostsFeed /> : null;
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
                        <Avatar avatarUrl={user?.avatarUrl} userId={user?.id} width={isMobile ? '100px' : '200px'} />
                    </div>
                    <UserDetails isOwnProfile={isOwnProfile} user={user} />
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
            {showModal && <AddPostOfferModal onClose={handleCloseModal} />}
        </>
    )
}

export default UserInfo;