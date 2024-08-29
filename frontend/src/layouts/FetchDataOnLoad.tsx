import { useEffect } from "react";
import { useUserService } from "../services/userService"
import { usePostService } from "../services/postService";


const FetchCurrentUserOnLoad = () => {
    const { fetchCurrentUser } = useUserService();
    const { fetchFavoritePostsByCurrentUser, fetchFeed } = usePostService()

    useEffect(() => {
        fetchFeed()
        fetchCurrentUser()
            .then(() => fetchFavoritePostsByCurrentUser());
    }, []);

    return <></>
}

export default FetchCurrentUserOnLoad;