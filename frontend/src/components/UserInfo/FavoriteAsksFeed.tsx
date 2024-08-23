import { useEffect } from "react";
import { useAppStore } from "../../appStore";
import Item from "./Item";
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
    console.log(favoriteAsks);

    return (
        <>
            <div style={{ display: 'flex', gap: '10px', fontSize: '1.75rem', fontWeight: '550', marginBottom: '10px' }}>
                <div> <span className={styles.shimmer}>Favorite Asks</span></div>
            </div>
            {favoriteAsks.map((ask) => (
                <div style={{
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

                            <div>
                                <p className={styles.titleText}>{ask.title}</p>
                                <p className={styles.descriptionText}>{ask.description}</p>
                                <p><a href={`user/${ask.user.id}`} className={styles.userLink}>{ask.user.displayName}</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default FavoriteAsksFeed