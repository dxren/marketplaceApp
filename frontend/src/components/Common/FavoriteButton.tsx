import { Heart } from "lucide-react"
import { useAppStore } from "../../appStore";
import { useAskService } from "../../services/askService";
import { useOfferService } from "../../services/offerService";

import styles from './styles.module.css';
import { useAuth } from "@clerk/clerk-react";

type FavoriteButtonProps = {
    itemType: 'ask' | 'offer';
    itemId: string;
}
const FavoriteButton = (props: FavoriteButtonProps) => {
    const {isSignedIn} = useAuth();
    if (!isSignedIn) return <></>
    
    const {itemType, itemId} = props;

    const {currentUser} = useAppStore();
    const {addFavoriteAsk, removeFavoriteAsk} = useAskService();
    const {addFavoriteOffer, removeFavoriteOffer} = useOfferService();
    
    const favoriteItemArray = itemType === 'ask' ? currentUser?.favoriteAsks : currentUser?.favoriteOffers;
    const isFavorited = favoriteItemArray ? favoriteItemArray.some(id => id === itemId) : false;

    console.log(favoriteItemArray);
    console.log(`Item ${itemId} isFavorited: ${isFavorited}`);

    const [addFavorite, removeFavorite] = itemType === 'ask' ? [addFavoriteAsk, removeFavoriteAsk] : [addFavoriteOffer, removeFavoriteOffer];

    const heartProps = isFavorited
    ? {
        color: '#e82c84',
        fill: '#e82c84',
        onClick: () => removeFavorite(itemId),
    }
    : {
        color: '#ffffff',
        onClick: () => addFavorite(itemId)
    };

    return (
        <Heart {...heartProps} className={styles.favoriteButton} />
    )
}

export default FavoriteButton;