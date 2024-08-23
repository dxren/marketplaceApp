import { useEffect, useState } from "react";
import { useAppStore } from "../../appStore";
import Item from "./Item";
import { useAskService } from "../../services/askService";


function FavoriteAsksFeed() {
    const { favoriteAsks } = useAppStore();

    const { fetchFavoriteAsksByCurrentUser } = useAskService();

    //grab the favorites from the store     
    useEffect(() => {
        fetchFavoriteAsksByCurrentUser();
    }, [])

    if (favoriteAsks.length === 0) {
        return (
            <div>
                You have no favorited Asks
            </div>
        )
    }
    console.log(favoriteAsks);

    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', paddingRight: '20px', overflowY: 'auto', marginBottom: '150px' }}>
            {favoriteAsks.map((ask) => <Item
                key={ask.id}
                item={ask}
                onChange={(_: never) => null}
                onDelete={() => null}
                canEdit={false} />
            )}
        </div>
    )
}

export default FavoriteAsksFeed