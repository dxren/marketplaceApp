import { useEffect } from "react";
import { useUserService } from "../services/userService"
import { useOfferService } from "../services/offerService";
import { usePostService } from "../services/postService";


const FetchCurrentUserOnLoad = () => {
    const { fetchCurrentUser } = useUserService();
    const { fetchFavoriteOffersByCurrentUser, fetchOffers } = useOfferService();
    const { fetchFavoritePostsByCurrentUser, fetchPosts } = usePostService()

    useEffect(() => {
        fetchCurrentUser()
        fetchOffers()
        fetchPosts()
        fetchFavoriteOffersByCurrentUser()
        fetchFavoritePostsByCurrentUser()
    }, []);

    return <></>
}

export default FetchCurrentUserOnLoad;