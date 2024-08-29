import { useAppStore } from "../../appStore";
import FavoritePost from "./FavoritePost";
import styles from './styles.module.css'

function FavoritePostsFeed() {
    const { favoritePosts } = useAppStore();

    if (favoritePosts.length === 0 ) {
        return (
            <div>
                You have no favorited Posts
            </div>
        )
    }

    return (
        <>
            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                <div> <span className={styles.title}>Favorite Posts</span></div>
            </div>
            <div style={{
                overflowY: 'auto',
                flex: 1,
                maxHeight: 'calc(100vh - 200px)', // Adjust this value as needed
                paddingRight: '10px' // Add some padding for the scrollbar
            }}>
                {favoritePosts.map((post) => (
                    <FavoritePost post={post} />
                ))}
            </div >
        </>
    )
}

export default FavoritePostsFeed