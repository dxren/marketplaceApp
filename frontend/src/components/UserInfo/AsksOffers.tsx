import { useState } from 'react';
import { useAppStore } from '../../appStore';
import { useAskService } from '../../services/askService';
import { useOfferService } from '../../services/offerService';
import styles from './styles.module.css'
import { MinusCircle, PlusCircle } from 'lucide-react';
import { useUserService } from '../../services/userService';
import AsksModal from '../Modals/AsksModal';
import OffersModal from '../Modals/OffersModal';

type EditableAskOffer = {
    title: string;
    description: string;
    id?: string;
}
type ItemProps = {
    item: EditableAskOffer;
    onChange(item: EditableAskOffer): void
    onDelete(): void
}
function Item(props: ItemProps) {
    const [title, setTitle] = useState<string>(props.item.title);
    const [description, setDescription] = useState<string>(props.item.description);
    
    const update = () => {
        props.onChange({title, description});
    }
    
    return (
        <div>
            <input value={title} onChange={e => setTitle(e.target.value)} onBlur={() => update()} onKeyDown={e => {if (e.key === 'Enter') update()}} />
            <input value={description} onChange={e => setDescription(e.target.value)} onBlur={() => update()} onKeyDown={e => {if (e.key === 'Enter') update()}} />
            <MinusCircle color='white' onClick={props.onDelete} />
        </div>
    )
}

function AsksOffers() {
    const {currentUser} = useAppStore();
    const {updateAskForCurrentUser, deleteAskForCurrentUser} = useAskService();
    const {updateOfferForCurrentUser, deleteOfferForCurrentUser} = useOfferService();
    const {fetchCurrentUser} = useUserService();
    const [showAskModal, setShowAskModal] = useState<boolean>(false);
    const [showOfferModal, setShowOfferModal] = useState<boolean>(false);

    const asks: EditableAskOffer[] = currentUser?.asks ?? [];
    const offers: EditableAskOffer[] = currentUser?.offers ?? [];

    console.log('A', asks);
    return (
        <div>
            <div>
                I am <span className={styles.shimmer}>offering</span>...
                <div>
                    {offers.map((offer, i) => <Item
                        key={offer.id ?? `offer_${i}`}
                        item={offer}
                        onChange={item => offer.id && updateOfferForCurrentUser(offer.id, item)} 
                        onDelete={() => offer.id && deleteOfferForCurrentUser(offer.id) }
                    />)}
                </div>
                <PlusCircle color='white' onClick={() => setShowOfferModal(true)} />
            </div>
            <div>
                I am <span className={styles.shimmerReverse}>seeking</span>...
                <div>
                    {asks.map((ask, i) => <Item
                        key={ask.id ?? `ask_${i}`}
                        item={ask}
                        onChange={item => ask.id && updateAskForCurrentUser(ask.id, item).then(() => fetchCurrentUser())}
                        onDelete={() => ask.id && deleteAskForCurrentUser(ask.id).then(() => fetchCurrentUser())}
                    />)}
                </div>
                <PlusCircle color='white' onClick={() => setShowAskModal(true)} />
            </div>
            {showOfferModal && <OffersModal onClose={() => {setShowOfferModal(false); fetchCurrentUser()}} />}
            {showAskModal && <AsksModal onClose={() => {setShowAskModal(false); fetchCurrentUser()}} />}
        </div>
    )
}

export default AsksOffers;