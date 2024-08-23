import { Link } from 'react-router-dom';
import { DEFAULT_AVATAR_URL } from '../../constants';
import styles from './styles.module.css';
import { MouseEvent } from 'react';

interface AvatarProps {
    avatarUrl?: string | null;
    userId?: string | null;
    width?: string;
    onClick?: (e: MouseEvent<HTMLImageElement>) => void;
}
function Avatar(props: AvatarProps) {
    const { avatarUrl, userId, width = '48px', onClick } = props;
    
    const AvatarInner = () =>
        <div className={styles.avatar} style={{width}}>
            <img src={avatarUrl || DEFAULT_AVATAR_URL} alt="User Avatar" onClick={onClick} />
        </div>
    
    if (userId) return <Link to={`/user/${userId}`}><AvatarInner /></Link>
    else return <AvatarInner />
}

export default Avatar;