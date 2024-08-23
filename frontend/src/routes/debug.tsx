import { useEffect } from "react";
import { useAppStore } from "../appStore";
import { useAskService } from "../services/askService";
import { useOfferService } from "../services/offerService";

const DebugPage = () => {
    const {favoriteAsks, favoriteOffers, favoriteAskCount, favoriteOfferCount} = useAppStore();
    const {fetchFavoriteAsksByCurrentUser} = useAskService();
    const {fetchFavoriteOffersByCurrentUser} = useOfferService();

    useEffect(() => {
        fetchFavoriteAsksByCurrentUser();
        fetchFavoriteOffersByCurrentUser();
    }, []);
    
    return (
        <div>
            <h2>Asks</h2>
            {favoriteAsks.map(x => <p>{x.title}</p>)}
            <p>Count: {favoriteAskCount}</p>
            <h2>Offers</h2>
            {favoriteOffers.map(x => <p>{x.title}</p>)}
            <p>Count: {favoriteOfferCount}</p>
        </div>
    )
}

export default DebugPage;