import { useState } from 'react';
import { useAppStore } from '../../appStore';
import { useOfferService } from '../../services/offerService';
import styles from './styles.module.css'
import AddAskOfferModal from '../Modals/AddAskOfferModal';
import Item, { EditableAskOffer } from './Item';

type OffersProps = {
    isOwnProfile: boolean;
}

function Offers(props: OffersProps) {
    const { currentUser, fetchedUser } = useAppStore();
    const { updateOfferForCurrentUser, deleteOfferForCurrentUser } = useOfferService();
    const [showOfferModal, setShowOfferModal] = useState<boolean>(false);

    const { isOwnProfile } = props;

    const asks: EditableAskOffer[] = isOwnProfile ? (currentUser?.asks ?? []) : (fetchedUser?.asks ?? []);
    const offers: EditableAskOffer[] = isOwnProfile ? (currentUser?.offers ?? []) : (fetchedUser?.offers ?? []);

    const hasAsks = asks.length > 0;
    const hasOffers = offers.length > 0;
    const hasContent = hasAsks || hasOffers;

    if (!isOwnProfile && !hasContent) {
        return (
            <div className={styles.noContentMessage}>
                This user hasn't added any asks or offers yet!
            </div>
        );
    }

    return (
        <div className={styles.offersContainer}>
            {(isOwnProfile || hasOffers) && (
                <div className={styles.offerSection}>
                    <div className={styles.offerHeader}>
                        <div className={styles.offerTitle}>
                        </div>
                    </div>
                    <div className={styles.offerList}>
                        {offers.map((offer, i) => (
                            <Item
                                key={offer.id ?? `offer_${i}`}
                                item={offer}
                                onChange={item => offer.id && updateOfferForCurrentUser(offer.id, item)}
                                onDelete={() => offer.id && deleteOfferForCurrentUser(offer.id)}
                                canEdit={isOwnProfile}
                            />
                        ))}
                    </div>
                </div>
            )}
            {showOfferModal && <AddAskOfferModal onClose={() => setShowOfferModal(false)} />}
        </div>
    )
}

export default Offers;