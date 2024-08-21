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
    const {currentUser, fetchedUser} = useAppStore();
    const {fetchCurrentUser, fetchUser} = useUserService();

    const isOwnProfile = userId === null;

    const user = isOwnProfile ? currentUser : fetchedUser;

    useEffect(() => {
        isOwnProfile
        ? fetchCurrentUser()
        : fetchUser(userId);
    }, [userId]);

    return (
        <div className={styles.userInfo}>
            <div className={styles.userInfoHeader}>
                <Avatar avatarUrl={user?.avatarUrl} />
                <UserDetails isOwnProfile={isOwnProfile} />
            </div>
                <AsksOffers isOwnProfile={isOwnProfile} />
        </div>
    )
}

export default UserInfo;