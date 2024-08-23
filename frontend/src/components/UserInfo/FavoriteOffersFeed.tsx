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
            <div style={{ display: 'flex', gap: '10px', fontSize: '1.75rem', fontWeight: '550', marginBottom: '10px' }}>
                <div> <span className={styles.shimmer}>Favorite Offers</span></div>
            </div>
            <div style={{
                overflowY: 'auto',
                flex: 1,
                maxHeight: 'calc(100vh - 200px)', // Adjust this value as needed
                paddingRight: '10px' // Add some padding for the scrollbar
            }}>
                {favoriteOffers.map((offer) => (
                    <div key={offer.id} className={styles.favoriteItem}>
                        <div style={{ display: 'flex', gap: '10px', flex: 1, justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <p className={styles.titleText}>{offer.title}</p>
                                <p className={styles.descriptionText}>{offer.description}</p>
                                <p><a href={`/user/${offer.user.id}`} className={styles.userLink}>{offer.user.displayName}</a></p>
                                <div className={styles.timestamp}>
                                    {(() => {
                                        const now = new Date();
                                        const createdAt = new Date(offer.createdAt);
                                        const diffInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / 60000);

                                        if (diffInMinutes < 60) {
                                            return "Posted: " + `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
                                        } else if (diffInMinutes < 1440) {
                                            const hours = Math.floor(diffInMinutes / 60);
                                            return "Posted: " + `${hours} hour${hours !== 1 ? 's' : ''} ago`;
                                        } else {
                                            return "Posted: " + createdAt.toLocaleDateString('en-US', {
                                                month: '2-digit',
                                                day: '2-digit',
                                                year: 'numeric'
                                            });
                                        }
                                    })()}
                                </div>                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default FavoriteOffersFeed

