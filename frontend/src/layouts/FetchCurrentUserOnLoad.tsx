import { useEffect } from "react";
import { useUserService } from "../services/userService"
import { useOfferService } from "../services/offerService";
import { useAskService } from "../services/askService";


const FetchCurrentUserOnLoad = () => {
    const { fetchCurrentUser } = useUserService();
    const { fetchFavoriteOffersByCurrentUser, fetchOffers } = useOfferService();
    const { fetchFavoriteAsksByCurrentUser, fetchAsks } = useAskService()

    useEffect(() => {
        fetchCurrentUser()
        fetchOffers()
        fetchAsks()
        fetchFavoriteOffersByCurrentUser()
        fetchFavoriteAsksByCurrentUser()
    }, []);

    return <></>
}

export default FetchCurrentUserOnLoad;