import { useEffect } from "react";
import { useAppStore } from "../../appStore";
import { useOfferService } from "../../services/offerService";
import styles from './styles.module.css'

function FavoriteOffersFeed() {
    const { favoriteOffers } = useAppStore();
    const { fetchFavoriteOffersByCurrentUser } = useOfferService();

    //grab the favorites from the store     
    useEffect(() => {
        fetchFavoriteOffersByCurrentUser();
    }, [])

    if (favoriteOffers.length === 0) {
        return (
            <div>
                You have no favorited Offers
            </div>
        )
    }

    return (
        <>
            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                <div> <span className={styles.title}>Favorite Offers</span></div>
            </div>
            <div style={{
                overflowY: 'auto',
                flex: 1,
                maxHeight: 'calc(100vh - 200px)', // Adjust this value as needed
                paddingRight: '10px' // Add some padding for the scrollbar
            }}>
                {favoriteOffers.map((offer) => (
                    <div key={offer.id} style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: '10px 15px',
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
                        <div style={{ display: 'flex', gap: '5px', flex: 1, justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <div>
                                    <p className={styles.titleText}>{offer.title}</p>
                                    <p className={styles.descriptionText}>{offer.description}</p>
                                    <p><a href={`user/${offer.user.id}`} className={styles.userLink}>{offer.user.displayName}</a></p>
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div >
        </>
    )
}

export default FavoriteOffersFeed

