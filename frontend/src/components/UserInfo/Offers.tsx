import { useState } from 'react';
import { useAppStore } from '../../appStore';
import { useOfferService } from '../../services/offerService';
import AddAskOfferModal from '../Modals/AddAskOfferModal';
import Item, { EditableAskOffer } from './Item';
// import FavoritesFeed from '../Feeds/FavoritesFeed';


type OffersProps = {
    isOwnProfile: boolean;
}
function Offers(props: OffersProps) {
    const { currentUser, fetchedUser } = useAppStore();
    const { updateOfferForCurrentUser, deleteOfferForCurrentUser } = useOfferService();
    const [showOfferModal, setShowOfferModal] = useState<boolean>(false);

    const { isOwnProfile } = props;

    const offers: EditableAskOffer[] = isOwnProfile ? (currentUser?.offers ?? []) : (fetchedUser?.offers ?? []);

    const hasOffers = offers.length > 0;

    if (!isOwnProfile && !hasOffers) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#fff9e6' }}>
                This user hasn't added any offers yet!
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', overflowY: 'auto', marginBottom: '150px' }}>
            {(isOwnProfile || hasOffers) && (
                <div style={{ flex: 1 }}>
                    {/* <div style={{ display: 'flex', gap: '10px', fontSize: '1.75rem', fontWeight: '550', marginBottom: '10px' }}> */}
                    {/* <div> I am <span className={styles.shimmer}>offering</span>...</div> */}
                    {/* {isOwnProfile && <PlusCircle style={{ display: 'flex', alignItems: 'center' }} color='white' onClick={() => setShowOfferModal(true)} />} */}
                    {/* </div> */}
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
            {showOfferModal && <AddAskOfferModal onClose={() => setShowOfferModal(false)} />}
        </div>
    )
}

export default Offers