import { useAppStore } from "../../appStore"
import Item from "./Item"

//refer to FetchCurrentUserOnLoad.tsx for how we are fetching the favorited offers and asks from the current user
//grab the favorite offers from the store

function FavoriteOffersFeed() {
    const { favoriteOffers } = useAppStore()

    if (favoriteOffers.length === 0) {
        return <div>
            You have no favorited offers
        </div>
    }
    return (
        <div>
            {favoriteOffers.map((offer) => <Item
                key={offer.id}
                item={offer}
                onChange={(_x: never) => null}
                onDelete={() => null}
                canEdit={false} />)}
        </div>
    )
}

export default FavoriteOffersFeed