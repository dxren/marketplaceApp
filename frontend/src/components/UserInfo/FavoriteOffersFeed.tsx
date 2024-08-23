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

            {favoriteOffers.map((offer) => (
                <div key={offer.id} style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '10px 35px',
                    gap: '18px',
                    border: '1px solid #fff9e6',
                    marginBottom: '10px',
                    borderRadius: '5px',
                    color: '#fff9e6',
                    position: 'relative',
                    background: 'linear-gradient(to right, rgba(84, 0, 55, 0.2), rgba(199, 21, 133, 0.2))',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    fontSize: '1.1rem',
                }}>
                    <div style={{ display: 'flex', gap: '10px', flex: 1, justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <p className={styles.titleText}>{offer.title}</p>
                            <p className={styles.descriptionText}>{offer.description}</p>
                            <p><a href={`/user/${offer.user.id}`} className={styles.userLink}>{offer.user.displayName}</a></p>
                        </div>
                    </div>
                </div>
            ))}

        </>
    )
}

export default FavoriteOffersFeed

