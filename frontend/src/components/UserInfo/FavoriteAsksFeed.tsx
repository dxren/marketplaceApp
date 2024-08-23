import { useEffect, useState } from "react";
import { useAppStore } from "../../appStore";
import { Ask } from "../../../../shared/types";
import Item from "./Item";

type FavoriteAsksProps = {
    isOwnProfile: boolean
}

function FavoriteAsksFeed(props: FavoriteAsksProps) {
    const { favoriteAsks } = useAppStore();
    const [favoriteAsks, setFavoriteAsks] = useState<string[]>([])
    const { isOwnProfile } = props;

    //grab the favorites from the store     
    useEffect(() => {
        if (fetchedUser) {
            const allFavoriteAsks = [
                fetchedUser.favoriteAsks,
            ];
            setFavoriteAsks(allFavoriteAsks.flat())
        }
    }, [fetchedUser])

    if (!isOwnProfile && favoriteAsks.length === 0) {
        return (
            <div>
                You have no favorited Asks
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', paddingRight: '20px', overflowY: 'auto', marginBottom: '150px' }}>
            {favoriteAsks.map((ask, i) =>
                <Item
                    key={ }
                />}
        </div>
    )
}

export default FavoriteAsksFeed