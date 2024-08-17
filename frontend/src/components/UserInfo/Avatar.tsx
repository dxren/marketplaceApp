import { DEFAULT_AVATAR_URL } from '../../constants';
import styles from './styles.module.css';

interface AvatarProps {
    avatarUrl: string | null | undefined;
}
function Avatar(props: AvatarProps) {
    const { avatarUrl } = props;
    return (
        <div className={styles.userInfoAvatar}>
            <img src={avatarUrl ?? DEFAULT_AVATAR_URL} />
        </div>
    )
}

export default Avatar;