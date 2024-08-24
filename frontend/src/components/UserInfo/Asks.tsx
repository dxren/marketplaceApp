import { useState } from 'react';
import { useAppStore } from '../../appStore';
import { useAskService } from '../../services/askService';
import styles from './styles.module.css'
import AddAskOfferModal from '../Modals/AddAskOfferModal';
import Item, { EditableAskOffer } from './Item';

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

    if (!isOwnProfile && !hasAsks) {
        return (
            <div className={styles.noContentMessage}>
                This user hasn't added any asks yet!
            </div>
        );
    }

    return (
        <div className={styles.asksContainer}>
            {(isOwnProfile || hasAsks) && (
                <div className={styles.askSection}>
                    <div className={styles.askHeader}>
                        <div className={styles.askTitle}>
                        </div>
                    </div>
                    <div className={styles.askList}>
                        {asks.map((ask, i) => (
                            <Item
                                key={ask.id ?? `ask_${i}`}
                                item={ask}
                                onChange={item => ask.id && updateAskForCurrentUser(ask.id, item)}
                                onDelete={() => ask.id && deleteAskForCurrentUser(ask.id)}
                                canEdit={isOwnProfile}
                            />
                        ))}
                    </div>
                </div>
            )}
            {showAskModal && <AddAskOfferModal onClose={() => setShowAskModal(false)} />}
        </div>
    )
}

export default Asks;