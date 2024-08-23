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
}

export const FeedToggle = ({ activeFeed, onToggle }: FeedToggleProps) => {

    return (
        <div className={styles.toggleContainer}>
            <button
                className={`${styles.toggleButton} ${activeFeed === FeedType.Offers ? styles.active : ''}`}
                onClick={() => { onToggle(FeedType.Offers) }}>
                Offers
            </button>
            <button
                className={`${styles.toggleButton} ${activeFeed === FeedType.Asks ? styles.active : ''}`}
                onClick={() => onToggle(FeedType.Asks)}>
                Asks
            </button>
            <button
                className={`${styles.toggleButton} ${activeFeed === FeedType.FavoriteOffers ? styles.active : ''}`}
                onClick={() => onToggle(FeedType.FavoriteOffers)}>
                Favorite Offers
            </button>
            <button
                className={`${styles.toggleButton} ${activeFeed === FeedType.FavoriteAsks ? styles.active : ''}`}
                onClick={() => onToggle(FeedType.FavoriteAsks)}>
                Favorite Asks
            </button>
        </div>
    )

}

