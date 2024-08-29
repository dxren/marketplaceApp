import { Heart } from "lucide-react"
import { useAppStore } from "../../appStore";
import { usePostService } from "../../services/postService";

import styles from './styles.module.css';
import { useAuth } from "@clerk/clerk-react";
import { MouseEvent } from "react";
import { Post } from "../../../../shared/apiTypes";

type FavoriteButtonProps = {
    post: Post
}
const FavoriteButton = (props: FavoriteButtonProps) => {
    const {isSignedIn} = useAuth();
    
    const {post} = props;
    
    const {favoritePosts} = useAppStore();
    const {addFavoritePost, removeFavoritePost} = usePostService();
    
    const isFavorited = favoritePosts.some(x => x.id === post.id);
    
    [addFavoritePost, removeFavoritePost];
    
    const heartProps = isFavorited
    ? {
        color: '#f0c2d7',
        fill: '#e82c84',
        onClick: (e: MouseEvent) => {e.stopPropagation(); removeFavoritePost(post)},
    }
    : {
        color: '#ffffff',
        onClick: (e: MouseEvent) => {e.stopPropagation(); addFavoritePost(post)},
    };
    
    if (!isSignedIn) return <></>
    return (
        <Heart {...heartProps} className={styles.favoriteButton} />
    )
}

export default FavoriteButton;