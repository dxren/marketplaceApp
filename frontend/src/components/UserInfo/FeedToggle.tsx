import styles from './styles.module.css';
export enum FeedType {
    Posts,
    Offers,
    FavoritePosts,
    FavoriteOffers
}

interface FeedToggleProps {
    activeFeed: FeedType;
    onToggle: (feed: FeedType) => void;
    availableFeedTypes: FeedType[]
}

export const FeedToggle = ({ activeFeed, onToggle, availableFeedTypes }: FeedToggleProps) => {

    return (
        <div className={styles.toggleContainer}>
            {availableFeedTypes.includes(FeedType.Offers) && (
                <button
                    className={`${styles.toggleButton} ${activeFeed === FeedType.Offers ? styles.active : ''}`}
                    onClick={() => { onToggle(FeedType.Offers) }}>
                    Offers
                </button>
            )}
            {availableFeedTypes.includes(FeedType.Posts) && (
                <button
                    className={`${styles.toggleButton} ${activeFeed === FeedType.Posts ? styles.active : ''}`}
                    onClick={() => { onToggle(FeedType.Posts) }}>
                    Posts
                </button>
            )}
            {availableFeedTypes.includes(FeedType.FavoriteOffers) && (
                <button
                    className={`${styles.toggleButton} ${activeFeed === FeedType.FavoriteOffers ? styles.active : ''}`}
                    onClick={() => { onToggle(FeedType.FavoriteOffers) }}>
                    Favorited Offers
                </button>
            )}
            {availableFeedTypes.includes(FeedType.FavoritePosts) && (
                <button
                    className={`${styles.toggleButton} ${activeFeed === FeedType.FavoritePosts ? styles.active : ''}`}
                    onClick={() => { onToggle(FeedType.FavoritePosts) }}>
                    Favorited Posts
                </button>
            )}
        </div>
    )

}

