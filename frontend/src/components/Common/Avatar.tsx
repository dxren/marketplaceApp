import { Link } from 'react-router-dom';
import { DEFAULT_AVATAR_URL } from '../../constants';
import styles from './styles.module.css';

interface AvatarProps {
    avatarUrl?: string | null;
    userId?: string;
    width?: string;
}
function Avatar(props: AvatarProps) {
    const { avatarUrl, userId, width = '48px' } = props;
    
    const AvatarInner = (props: AvatarProps) =>
        <div className={styles.avatar} style={{width}}>
            <img src={avatarUrl || DEFAULT_AVATAR_URL} alt="User Avatar" />
        </div>
    
    if (userId) return <Link to={`/user/${userId}`}><AvatarInner {...props} /></Link>
    else return <AvatarInner {...props} />
}

export default Avatar;