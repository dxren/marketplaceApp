import { useOfferService } from "../../services/offerService"
import { Offer } from "../../../../shared/types";
import { useUserService } from "../../services/userService";
import { useAppStore } from "../../appStore";
import styles from './styles.module.css';
import { useEffect, useState } from "react";
import Avatar from "../Common/Avatar";

interface DisplayOfferModalProps {
    id: string
    onClose: () => void
}

const DisplayOfferModal = ({ id, onClose }: DisplayOfferModalProps) => {
    const { getOfferById } = useOfferService();
    const { fetchUser } = useUserService();
    const [offer, setOffer] = useState<Offer>();
    const { currentUser } = useAppStore();

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const fetchedOffer = await getOfferById(id) ?? undefined
                setOffer(fetchedOffer)
                if (fetchedOffer) {
                    fetchUser(fetchedOffer.user.id)
                }
            }
            catch (error) {
                console.error("Error fetching offer", error)
            }
        }
        fetchOffer()
    }, [id])

    return (
        <div className={styles.offersModalBackground}>
            <div className={styles.offersModal}>
                <button onClick={onClose} className={styles.offersModalCloseButton}>x</button>
                <h2>{offer?.title}</h2>
                <p>{offer?.description}</p>
                <div>
                    <Avatar userId={offer?.user.id} avatarUrl={offer?.user.avatarUrl} />
                    <span> {offer?.user.displayName}</span>
                </div>
                <div>
                    <p> While we build out messaging, we recommend reaching out to the user via their social links below!</p>
                    {currentUser?.socials.map(social => <p> {social.name}: {social.value}</p>)}
                </div>
            </div>
        </div>
    )
}

export default DisplayOfferModal