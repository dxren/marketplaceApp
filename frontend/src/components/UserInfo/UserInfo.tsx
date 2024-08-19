import { useEffect } from "react"
import styles from './styles.module.css';
import { useUserService } from "../../services/userService";
import Avatar from "./Avatar";
import UserDetails from "./UserDetails";
import AsksOffers from "./AsksOffers";
import { useAppStore } from "../../appStore";

export enum Mode {View, Edit};

interface UserInfoProps {
    userId: string | null;  // When null, assume currently logged-in user
}

function UserInfo(props: UserInfoProps) {
    const {userId} = props;
    const {currentUser} = useAppStore();
    const {fetchCurrentUser, fetchUser} = useUserService();

    const isOwnProfile = userId === null;

    useEffect(() => {
        isOwnProfile
        ? fetchCurrentUser()
        : fetchUser(userId);
    }, [userId]);

    return (
        <div className={styles.userInfo}>
            <div className={styles.userInfoHeader}>
                <div className={styles.avatarContainer}>
                    <Avatar avatarUrl={currentUser?.avatarUrl} />
                </div>
                <div className={styles.userDetailsContainer}>
                    <UserDetails canEdit={isOwnProfile} />
                </div>
            </div>
                <AsksOffers canEdit={isOwnProfile} />
        </div>
    )
}

export default UserInfo;