import { useAppStore } from "../../appStore"
import styles from './styles.module.css'

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
        <>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '10px', fontSize: '1.75rem', fontWeight: '550', marginBottom: '10px' }}>
                    <div> <span className={styles.shimmer}>Favorite Offers</span></div>
                </div>
                <div>
                    {favoriteOffers.map((offer) => (
                        <div>
                            <p>{offer.title}</p>
                            <p>{offer.description}</p>
                            <p>{offer.user.displayName}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default FavoriteOffersFeed

