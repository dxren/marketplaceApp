import { useEffect } from "react";
import { useAppStore } from "../../appStore";
import { useAskService } from "../../services/askService";
import styles from './styles.module.css'


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

    return (
        <>
            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                <div> <span className={styles.title}>Favorite Asks</span></div>
            </div>
            <div style={{
                overflowY: 'auto',
                flex: 1,
                maxHeight: 'calc(100vh - 200px)', // Adjust this value as needed
                paddingRight: '10px' // Add some padding for the scrollbar
            }}>
                {favoriteAsks.map((ask) => (
                    <div
                        key={ask.id}
                        style={{
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
                        }}
                    >
                        <div style={{ display: 'flex', gap: '5px', flex: 1, justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

                                <div>
                                    <p className={styles.titleText}>{ask.title}</p>
                                    <p className={styles.descriptionText}>{ask.description}</p>
                                    <p><a href={`user/${ask.user.id}`} className={styles.userLink}>{ask.user.displayName}</a></p>
                                    <div className={styles.timestamp}>
                                        {(() => {
                                            const now = new Date();
                                            const createdAt = new Date(ask.createdAt);
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

export default FavoriteAsksFeed