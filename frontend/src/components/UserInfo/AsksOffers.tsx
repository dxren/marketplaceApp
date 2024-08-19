import { useState } from 'react';
import { useAppStore } from '../../appStore';
import { useAskService } from '../../services/askService';
import { useOfferService } from '../../services/offerService';
import styles from './styles.module.css'
import { Check, MinusCircle, Pencil, PlusCircle, X } from 'lucide-react';
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
    canEdit: boolean;
}
function Item(props: ItemProps) {
    const [title, setTitle] = useState<string>(props.item.title);
    const [description, setDescription] = useState<string>(props.item.description);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    
    const update = () => {
        props.onChange({title, description});
        setIsEditing(false);
    }

    const cancel = () => {
        setTitle(props.item.title);
        setDescription(props.item.description)
        setIsEditing(false);
    }
    
    return (
        <div>
            <div>
                <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    disabled={!isEditing}
                    className={styles.editable}
                />
                <input
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    disabled={!isEditing}
                    className={styles.editable}
                />
                { props.canEdit &&
                    <>
                        <Pencil color='white' onClick={() => setIsEditing(prev => !prev)} />
                        <MinusCircle color='white' onClick={props.onDelete} />
                    </>
                }
            </div>
            { isEditing &&
                <div>
                    <X onClick={cancel} />
                    <Check onClick={update} />
                </div>
            }
        </div>
    )
}

type AsksOffersProps = {
    canEdit: boolean;
}
function AsksOffers(props: AsksOffersProps) {
    const {currentUser} = useAppStore();
    const {updateAskForCurrentUser, deleteAskForCurrentUser} = useAskService();
    const {updateOfferForCurrentUser, deleteOfferForCurrentUser} = useOfferService();
    const [showAskModal, setShowAskModal] = useState<boolean>(false);
    const [showOfferModal, setShowOfferModal] = useState<boolean>(false);

    const asks: EditableAskOffer[] = currentUser?.asks ?? [];
    const offers: EditableAskOffer[] = currentUser?.offers ?? [];
    const canEdit = props.canEdit;

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
                        onDelete={() => offer.id && deleteOfferForCurrentUser(offer.id)}
                        canEdit={canEdit}
                    />)}
                </div>
                {canEdit && <PlusCircle color='white' onClick={() => setShowOfferModal(true)} />}
            </div>
            <div>
                I am <span className={styles.shimmerReverse}>seeking</span>...
                <div>
                    {asks.map((ask, i) => <Item
                        key={ask.id ?? `ask_${i}`}
                        item={ask}
                        onChange={item => ask.id && updateAskForCurrentUser(ask.id, item)}
                        onDelete={() => ask.id && deleteAskForCurrentUser(ask.id)}
                        canEdit={canEdit}
                    />)}
                </div>
                {canEdit && <PlusCircle color='white' onClick={() => setShowAskModal(true)} />}
            </div>
            {showOfferModal && <OffersModal onClose={() => setShowOfferModal(false)} />}
            {showAskModal && <AsksModal onClose={() => setShowAskModal(false)} />}
        </div>
    )
}

export default AsksOffers;