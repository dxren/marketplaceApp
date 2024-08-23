import { useEffect, useState } from "react"
import styles from './styles.module.css';
import { useUserService } from "../../services/userService";
import Avatar from "../Common/Avatar";
import UserDetails from "./UserDetails";
import AsksOffers from "./AsksOffers";
import { useAppStore } from "../../appStore";
import { FeedToggle, FeedType } from "./FeedToggle";

export enum Mode { View, Edit };

interface UserInfoProps {
    userId: string | null;  // When null, assume currently logged-in user
}

function UserInfo(props: UserInfoProps) {
    const { userId } = props;
    const { currentUser, fetchedUser } = useAppStore();
    const { fetchCurrentUser, fetchUser } = useUserService();
    const [activeFeed, setActiveFeed] = useState<FeedType>(FeedType.Offers)

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

    return (
        <div className={styles.userInfo}>
            <div className={styles.userInfoHeader}>

                <div className={styles.userInfoAvatar}>
                    <Avatar avatarUrl={user?.avatarUrl} userId={userId} width={'200px'} />
                </div>
                <UserDetails isOwnProfile={isOwnProfile} />
            </div>
            <FeedToggle activeFeed={activeFeed} onToggle={handleFeedToggle} />
            <AsksOffers isOwnProfile={isOwnProfile} />

        </div>
    )
}

export default UserInfo;