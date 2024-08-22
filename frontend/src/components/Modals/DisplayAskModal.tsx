import { useEffect, useState } from "react";
import { useAskService } from "../../services/askService"
import { Ask } from "../../../../shared/types";
import { useUserService } from "../../services/userService";
import { useAppStore } from "../../appStore";
import styles from './styles.module.css';
import FavoriteButton from "../Common/FavoriteButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { DEFAULT_AVATAR_URL } from "../../constants";
import { X } from "lucide-react";

interface DisplayAskModalProps {
    id: string
    onClose: () => void
}

const DisplayAskModal = ({ id, onClose }: DisplayAskModalProps) => {
    const { getAskById } = useAskService();
    const { fetchUser } = useUserService();
    const [ask, setAsk] = useState<Ask>()
    const { fetchedUser } = useAppStore();
    const { currentUser } = useAppStore();
    const navigate = useNavigate();
    const { userId } = useAuth();

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

    const handleUserClick = () => {
        if (userId && userId === ask?.user.id) {
            navigate('/profile');
        } else if (ask?.user.id) {
            navigate(`/user/${ask.user.id}`);
        }
    };

    const flagColor = '#ff6bb5';
    const flagText = 'SEEKING';

    if (!ask) return null;

    return (
        <div style={{
            backgroundColor: 'rgba(119, 136, 153, 0.9)',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 10,
        }}>
            <div style={{
                color: '#FFF9E6',
                background: 'linear-gradient(to right, #8B3A62, #FF6BB5)',
                width: '500px',
                height: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                borderRadius: '10px',
                border: '2px solid #FFFAFA',
                padding: '40px',
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                }}><X size={32} color='#fff9e6' /></button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={ask.user.avatarUrl || DEFAULT_AVATAR_URL} alt={ask.user.displayName} style={{ width: '48px', height: '48px', borderRadius: '100%', marginRight: '10px', cursor: 'pointer' }} onClick={handleUserClick} />
                    <span style={{ fontSize: '1.2rem', cursor: 'pointer' }} onClick={handleUserClick}>{ask.user.displayName}</span>
                    <div>•</div> 
                    <div> {new Date(ask.createdAt).toLocaleDateString()} </div>  
                    <div style={{
                        padding: '3px 8px',
                        borderRadius: '10px',
                        backgroundColor: flagColor,
                        color: '#fff9e6',
                        fontFamily: 'sans-serif',
                        fontSize: '0.85rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                        background: `linear-gradient(135deg, ${flagColor}, ${flagColor}cc)`,
                        border: `1px solid ${flagColor}33`,
                        textShadow: '0 1px 1px rgba(0,0,0,0.1)',
                        zIndex: 1,
                    }}>{flagText}</div>
                </div>
                <div>
                    <p> While we build out messaging, we recommend reaching out to the user via their social links below!</p>
                    {fetchedUser?.socials.map(social => <p> {social.name}: {social.value}</p>)}
                <p style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{ask.title}</p>
                <p style={{ fontSize: '1rem', marginBottom: '20px' }}>{ask.description}</p>
                <div style={{ borderTop: '1px solid #fff9e6', paddingTop: '10px', marginBottom: '10px' }}>
                    <p style={{ fontSize: '.85rem', marginBottom: '10px' }}>While we build out messaging, we recommend reaching out to the user via their social links below!</p>
                    {currentUser?.socials.map((social, index) => (
                        <p key={index} style={{ fontSize: '0.9rem' }}>{social.name}: {social.value}</p>
                    ))}
                </div>
                { ask &&
                    <div className={styles.layoutFavoriteButton}>
                        <FavoriteButton itemId={ask?.id} itemType="ask" />
                    </div>
                }
                </div>
            </div>
        </div>
    )
}

export default DisplayAskModal