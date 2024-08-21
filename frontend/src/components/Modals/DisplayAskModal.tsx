
import { useEffect, useState } from "react";
import { useAskService } from "../../services/askService"
import { Ask } from "../../../../shared/types";
import { useUserService } from "../../services/userService";
import { useAppStore } from "../../appStore";
import styles from './styles.module.css';
import Avatar from "../Common/Avatar";

interface DisplayAskModalProps {
    id: string
    onClose: () => void
}

const DisplayAskModal = ({ id, onClose }: DisplayAskModalProps) => {
    const { getAskById } = useAskService();
    const { fetchUser } = useUserService();
    const [ask, setAsk] = useState<Ask>()
    const { currentUser } = useAppStore();

    useEffect(() => {
        const fetchAsk = async () => {
            try {
                const fetchedAsk = (await getAskById(id)) ?? undefined
                setAsk(fetchedAsk)
                if (fetchedAsk) {
                    fetchUser(fetchedAsk?.user.id)
                }
            }
            catch (error) {
                console.error("Error fetching ask:", error)
            }
        }
        fetchAsk()
    }, [id])

    return (
        <div className={styles.askModalBackground}>
            <div className={styles.askModal}>
                <button onClick={onClose} className={styles.askModalCloseButton}>x</button>
                <h2>{ask?.title}</h2>
                <p>{ask?.description}</p>
                <div>
                    <Avatar userId={ask?.user.id} avatarUrl={ask?.user.avatarUrl} />
                    <span> {ask?.user.displayName}</span>
                </div>
                <div>
                    <p> While we build out messaging, we recommend reaching out to the user via their social links below!</p>
                    {currentUser?.socials.map(social => <p> {social.name}: {social.value}</p>)}
                </div>
            </div>
        </div>
    )
}

export default DisplayAskModal