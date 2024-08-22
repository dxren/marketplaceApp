import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../appStore';
import { useAskService } from '../../services/askService';
import { useOfferService } from '../../services/offerService';
import styles from './styles.module.css'
import { Check, Pencil, PlusCircle, Trash, X } from 'lucide-react';
import AsksModal from '../Modals/CreateAsksModal';
import OffersModal from '../Modals/CreateOffersModal';


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
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const update = () => {
        props.onChange({ title, description });
        setIsEditing(false);
    }

    const cancel = () => {
        setTitle(props.item.title);
        setDescription(props.item.description)
        setIsEditing(false);
    }

    const updateTextAreaSize = () => {
        if (!textareaRef.current) return;
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }

    useEffect(() => updateTextAreaSize(), []);

    const updateDescription = (newDescription: string) => {
        setDescription(newDescription);
        updateTextAreaSize();
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '10px 35px',
            gap: '18px',
            border: '1px solid #fff9e6',
            marginBottom: '10px',
            borderRadius: '5px',
            color: '#fff9e6',
            position: 'relative',
            background: 'linear-gradient(to right, rgba(84, 0, 55, 0.2), rgba(199, 21, 133, 0.2))',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s ease',
            fontSize: '1.1rem',
        }}>
            <div style={{ display: 'flex', gap: '10px', flex: 1, justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div className={styles.titleText}>
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            disabled={!isEditing}
                            className={`${styles.editable} ${styles.titleInput} ${!isEditing ? styles.disabled : ''}`}
                        />
                    </div>
                    <div className={styles.descriptionText}>
                        <textarea
                            ref={textareaRef}
                            value={description}
                            onChange={e => updateDescription(e.target.value)}
                            disabled={!isEditing}
                            className={`${styles.editable} ${styles.descriptionInput} ${!isEditing ? styles.disabled : ''}`}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', minWidth: '32px' }}>
                    {props.canEdit && !isEditing &&
                        <Pencil color='#fff9e6' onClick={() => setIsEditing(prev => !prev)} />
                    }
                    {isEditing &&
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <Check size={32} color='#fff9e6' onClick={update} />
                            <Trash color='#fff9e6' onClick={props.onDelete} />
                            <X size={32} color='#fff9e6' onClick={cancel} />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

type AsksOffersProps = {
    canEdit: boolean;
}
function AsksOffers(props: AsksOffersProps) {
    const { currentUser } = useAppStore();
    const { updateAskForCurrentUser, deleteAskForCurrentUser } = useAskService();
    const { updateOfferForCurrentUser, deleteOfferForCurrentUser } = useOfferService();
    const [showAskModal, setShowAskModal] = useState<boolean>(false);
    const [showOfferModal, setShowOfferModal] = useState<boolean>(false);

    const asks: EditableAskOffer[] = currentUser?.asks ?? [];
    const offers: EditableAskOffer[] = currentUser?.offers ?? [];
    const canEdit = props.canEdit;

    const hasAsks = asks.length > 0;
    const hasOffers = offers.length > 0;
    const hasContent = hasAsks || hasOffers;

    if (!canEdit && !hasContent) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#fff9e6' }}>
                This user hasn't added any asks or offers yet!
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', overflowY: 'auto', marginBottom: '150px' }}>
            {(canEdit || hasOffers) && (
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '1.75rem', fontWeight: '550', marginBottom: '10px' }}>
                        <div> I am <span className={styles.shimmer}>offering</span>...</div>
                        {canEdit && <PlusCircle style={{ display: 'flex', alignItems: 'center' }} color='white' onClick={() => setShowOfferModal(true)} />}
                    </div>
                    <div>
                        {offers.map((offer, i) => <Item
                            key={offer.id ?? `offer_${i}`}
                            item={offer}
                            onChange={item => offer.id && updateOfferForCurrentUser(offer.id, item)}
                            onDelete={() => offer.id && deleteOfferForCurrentUser(offer.id)}
                            canEdit={canEdit}
                        />)}
                    </div>
                </div>
            )}

            {(canEdit || hasAsks) && (
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '1.75rem', fontWeight: '550', marginBottom: '10px' }}>
                        <div> I am <span className={styles.shimmerReverse}>seeking</span>...</div>
                        {canEdit && <PlusCircle style={{ display: 'flex', alignItems: 'center' }} color='white' onClick={() => setShowAskModal(true)} />}
                    </div>
                    <div style={{ overflowY: 'auto' }}>
                        {asks.map((ask, i) => <Item
                            key={ask.id ?? `ask_${i}`}
                            item={ask}
                            onChange={item => ask.id && updateAskForCurrentUser(ask.id, item)}
                            onDelete={() => ask.id && deleteAskForCurrentUser(ask.id)}
                            canEdit={canEdit}
                        />)}
                    </div>
                </div>
            )}
            {showOfferModal && <OffersModal onClose={() => setShowOfferModal(false)} />}
            {showAskModal && <AsksModal onClose={() => setShowAskModal(false)} />}
        </div>
    )
}

export default AsksOffers;