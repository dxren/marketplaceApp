import { useEffect, useState } from "react";
import { useAppStore } from "../../appStore";
import { Ask } from "../../../../shared/types";

//grab the favorites from the store 
function FavoriteAsksFeed() {
    const { fetchedUser } = useAppStore();
    const [favoriteAsks, setFavoriteAsks] = useState<string[]>([])

    useEffect(() => {
        if (fetchedUser) {
            const allFavoriteAsks = [
                fetchedUser.favoriteAsks,
            ];
            setFavoriteAsks(allFavoriteAsks.flat())
        }
    }, [fetchedUser])

    return (
        <div>
            test favorites
        </div>
    )
}

export default FavoriteAsksFeed