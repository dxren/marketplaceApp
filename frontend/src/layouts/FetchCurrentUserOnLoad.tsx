import { useEffect } from "react";
import { useUserService } from "../services/userService"

const FetchCurrentUserOnLoad = () => {
    const {fetchCurrentUser} = useUserService();

    useEffect(() => {fetchCurrentUser()}, []);

    return <></>
}

export default FetchCurrentUserOnLoad;