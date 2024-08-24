import { useState } from 'react';
import { useAppStore } from '../../appStore';
import { useAskService } from '../../services/askService';
import { useOfferService } from '../../services/offerService';
import styles from './styles.module.css'
import { PlusCircle } from 'lucide-react';
import AddAskOfferModal from '../Modals/AddAskOfferModal';
import Item, { EditableAskOffer } from './Item';
// import FavoritesFeed from '../Feeds/FavoritesFeed';


type AsksOffersProps = {
    isOwnProfile: boolean;
}
function AsksOffers(props: AsksOffersProps) {
    const { currentUser, fetchedUser } = useAppStore();
    const { updateAskForCurrentUser, deleteAskForCurrentUser } = useAskService();
    const { updateOfferForCurrentUser, deleteOfferForCurrentUser } = useOfferService();
    const [showAskModal, setShowAskModal] = useState<boolean>(false);
    const [showOfferModal, setShowOfferModal] = useState<boolean>(false);

    const { isOwnProfile } = props;

    const asks: EditableAskOffer[] = isOwnProfile ? (currentUser?.asks ?? []) : (fetchedUser?.asks ?? []);
    const offers: EditableAskOffer[] = isOwnProfile ? (currentUser?.offers ?? []) : (fetchedUser?.offers ?? []);

    const hasAsks = asks.length > 0;
    const hasOffers = offers.length > 0;
    const hasContent = hasAsks || hasOffers;

    if (!isOwnProfile && !hasContent) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#fff9e6' }}>
                This user hasn't added any asks or offers yet!
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', paddingRight: '20px', overflowY: 'auto'}}>
            {(isOwnProfile || hasOffers) && (
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '1.75rem', fontWeight: '550', marginBottom: '10px' }}>
                        <div> I am <span className={styles.shimmer}>offering</span>...</div>
                        {isOwnProfile && <PlusCircle style={{ display: 'flex', alignItems: 'center' }} color='white' onClick={() => setShowOfferModal(true)} />}
                    </div>
                    <div>
                        {offers.map((offer, i) => <Item
                            key={offer.id ?? `offer_${i}`}
                            item={offer}
                            onChange={item => offer.id && updateOfferForCurrentUser(offer.id, item)}
                            onDelete={() => offer.id && deleteOfferForCurrentUser(offer.id)}
                            canEdit={isOwnProfile}
                        />)}
                    </div>
                </div>
            )}

            {(isOwnProfile || hasAsks) && (
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '1.75rem', fontWeight: '550', marginBottom: '10px' }}>
                        <div> I am <span className={styles.shimmerReverse}>seeking</span>...</div>
                        {isOwnProfile && <PlusCircle style={{ display: 'flex', alignItems: 'center' }} color='white' onClick={() => setShowAskModal(true)} />}
                    </div>
                    <div style={{ overflowY: 'auto' }}>
                        {asks.map((ask, i) => <Item
                            key={ask.id ?? `ask_${i}`}
                            item={ask}
                            onChange={item => ask.id && updateAskForCurrentUser(ask.id, item)}
                            onDelete={() => ask.id && deleteAskForCurrentUser(ask.id)}
                            canEdit={isOwnProfile}
                        />)}
                    </div>
                </div>
            )}
            {showOfferModal && <AddAskOfferModal onClose={() => setShowOfferModal(false)} />}
            {showAskModal && <AddAskOfferModal onClose={() => setShowAskModal(false)} />}
        </div>
    )
}

export default AsksOffers;