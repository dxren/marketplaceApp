import { useState } from 'react';
import { useAppStore } from '../../appStore';
import { useAskService } from '../../services/askService';
import styles from './styles.module.css'
import { PlusCircle } from 'lucide-react';
import AsksModal from '../Modals/CreateAsksModal';
import Item, { EditableAskOffer } from './Item';
// import FavoritesFeed from '../Feeds/FavoritesFeed';


type AsksProps = {
    isOwnProfile: boolean;
}
function Asks(props: AsksProps) {
    const { currentUser, fetchedUser } = useAppStore();
    const { updateAskForCurrentUser, deleteAskForCurrentUser } = useAskService();
    const [showAskModal, setShowAskModal] = useState<boolean>(false);

    const { isOwnProfile } = props;

    const asks: EditableAskOffer[] = isOwnProfile ? (currentUser?.asks ?? []) : (fetchedUser?.asks ?? []);

    const hasAsks = asks.length > 0;
    const hasContent = hasAsks;

    if (!isOwnProfile && !hasContent) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#fff9e6' }}>
                This user hasn't added any asks yet!
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', overflowY: 'auto', marginBottom: '150px' }}>
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
            {showAskModal && <AsksModal onClose={() => setShowAskModal(false)} />}
        </div>
    )
}

export default Asks;