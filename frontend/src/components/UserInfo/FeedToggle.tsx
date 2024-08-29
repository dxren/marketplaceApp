import styles from './styles.module.css';
export enum FeedType {
    Posts,
    FavoritePosts,
}

interface FeedToggleProps {
    activeFeed: FeedType;
    onToggle: (feed: FeedType) => void;
    availableFeedTypes: FeedType[]
}

export const FeedToggle = ({ activeFeed, onToggle, availableFeedTypes }: FeedToggleProps) => {

    return (
        <div className={styles.toggleContainer}>
            {availableFeedTypes.includes(FeedType.Posts) && (
                <button
                    className={`${styles.toggleButton} ${activeFeed === FeedType.Posts ? styles.active : ''}`}
                    onClick={() => { onToggle(FeedType.Posts) }}>
                    Posts
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

