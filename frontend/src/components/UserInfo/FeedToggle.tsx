import styles from './styles.module.css';
export enum FeedType {
    Asks,
    Offers,
    FavoriteAsks,
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
            {availableFeedTypes.includes(FeedType.Asks) && (
                <button
                    className={`${styles.toggleButton} ${activeFeed === FeedType.Asks ? styles.active : ''}`}
                    onClick={() => { onToggle(FeedType.Asks) }}>
                    Asks
                </button>
            )}
            {availableFeedTypes.includes(FeedType.FavoriteOffers) && (
                <button
                    className={`${styles.toggleButton} ${activeFeed === FeedType.FavoriteOffers ? styles.active : ''}`}
                    onClick={() => { onToggle(FeedType.FavoriteOffers) }}>
                    Favorited Offers
                </button>
            )}
            {availableFeedTypes.includes(FeedType.FavoriteAsks) && (
                <button
                    className={`${styles.toggleButton} ${activeFeed === FeedType.FavoriteAsks ? styles.active : ''}`}
                    onClick={() => { onToggle(FeedType.FavoriteAsks) }}>
                    Favorited Asks
                </button>
            )}
        </div>
    )

}

