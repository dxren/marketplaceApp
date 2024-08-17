import { useEffect } from "react"

import styles from './styles.module.css';
import { useUserService } from "../../services/userService";
import { useLocalUserStore } from "./localUserStore";
import Avatar from "./Avatar";
import UserDetails from "./UserDetails";
import { useAppStore } from "../../appStore";
import AsksOffers from "./AsksOffers";

export enum Mode {View, Edit};

interface UserInfoProps {
    userId: string | null;  // When null, assume currently logged-in user
}

function UserInfo(props: UserInfoProps) {
    const {userId} = props;
    const {currentUser} = useAppStore();
    const userStore = useLocalUserStore();
    const userService = useUserService();

    const isOwnProfile = userId === null;

    useEffect(() => {
        userId !== null
        ? userService.fetchUser(userId)
        : userService.fetchCurrentUser();
    }, [userId]);

    useEffect(() => {
        userStore.setLocalUser(currentUser);
    }, [currentUser]);

    return (
        <div className={styles.userInfo}>
            <div className={styles.userInfoHeader}>
                <Avatar avatarUrl={userStore.localUser?.avatarUrl} />
                <UserDetails userStore={userStore} canEdit={isOwnProfile} />
            </div>
                <AsksOffers userStore={userStore} />
        </div>
    )
}

export default UserInfo;