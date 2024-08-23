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
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '10px', fontSize: '1.75rem', fontWeight: '550', marginBottom: '10px' }}>
                    <div> <span className={styles.shimmer}>Favorite Asks</span></div>
                </div>
                <div>
                    {favoriteAsks.map((ask) => (
                        <div>
                            <p>{ask.title}</p>
                            <p>{ask.description}</p>
                            <p>{ask.user.displayName}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default FavoriteAsksFeed