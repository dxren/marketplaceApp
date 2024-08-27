import { Heart } from "lucide-react"
import { useAppStore } from "../../appStore";
import { usePostService } from "../../services/postService";
import { useOfferService } from "../../services/offerService";

import styles from './styles.module.css';
import { useAuth } from "@clerk/clerk-react";
import { MouseEvent } from "react";

type FavoriteButtonProps = {
    itemType: 'post' | 'offer';
    itemId: string;
}
const FavoriteButton = (props: FavoriteButtonProps) => {
    const {isSignedIn} = useAuth();
    
    const {itemType, itemId} = props;
    
    const {currentUser} = useAppStore();
    const {addFavoritePost, removeFavoritePost} = usePostService();
    const {addFavoriteOffer, removeFavoriteOffer} = useOfferService();
    
    const favoriteItemArray = itemType === 'post' ? currentUser?.favoritePosts : currentUser?.favoriteOffers;
    const isFavorited = favoriteItemArray ? favoriteItemArray.some(id => id === itemId) : false;
    
    const [addFavorite, removeFavorite] = itemType === 'post' ? [addFavoritePost, removeFavoritePost] : [addFavoriteOffer, removeFavoriteOffer];
    
    const heartProps = isFavorited
    ? {
        color: '#f0c2d7',
        fill: '#e82c84',
        onClick: (e: MouseEvent) => {e.stopPropagation(); removeFavorite(itemId)},
    }
    : {
        color: '#ffffff',
        onClick: (e: MouseEvent) => {e.stopPropagation(); addFavorite(itemId)},
    };
    
    if (!isSignedIn) return <></>
    return (
        <Heart {...heartProps} className={styles.favoriteButton} />
    )
}

export default FavoriteButton;