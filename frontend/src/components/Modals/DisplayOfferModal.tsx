import { useEffect, useState } from "react";
import { useOfferService } from "../../services/offerService"
import { Offer } from "../../../../shared/types";
import { useUserService } from "../../services/userService";
import { useAppStore } from "../../appStore";
import styles from './styles.module.css';
import FavoriteButton from "../Common/FavoriteButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { DEFAULT_AVATAR_URL } from "../../constants";
import { X } from "lucide-react";

interface DisplayOfferModalProps {
    id: string
    onClose: () => void
}

const DisplayOfferModal = ({ id, onClose }: DisplayOfferModalProps) => {
    const { getOfferById } = useOfferService();
    const { fetchUser } = useUserService();
    const [offer, setOffer] = useState<Offer>();
    const { fetchedUser } = useAppStore();
    const { currentUser } = useAppStore();
    const navigate = useNavigate();
    const { userId } = useAuth();

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const fetchedOffer = (await getOfferById(id)) ?? undefined
                setOffer(fetchedOffer)
                if (fetchedOffer) {
                    fetchUser(fetchedOffer?.user.id)
                }
            }
            catch (error) {
                console.error("Error fetching offer:", error)
            }
        }
        fetchOffer()
    }, [id])

    const handleUserClick = () => {
        if (userId && userId === offer?.user.id) {
            navigate('/profile');
        } else if (offer?.user.id) {
            navigate(`/user/${offer.user.id}`);
        }
    };

    const flagColor = '#544bcc';
    const flagText = 'OFFERING';

    if (!offer) return null;

    return (
        <div style={{
            backgroundColor: 'rgba(119, 136, 153, 0.9)', // Changed to use rgba for opacity
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
                }}><X size={32} color='#fff9e6'  /></button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={offer.user.avatarUrl || DEFAULT_AVATAR_URL} alt={offer.user.displayName} style={{ width: '48px', height: '48px', borderRadius: '100%', marginRight: '10px', cursor: 'pointer' }} onClick={handleUserClick} />
                    <span style={{ fontSize: '1.2rem', cursor: 'pointer' }} onClick={handleUserClick}>{offer.user.displayName}</span>
                    <div>•</div> 
                    <div> {offer.createdAt.toLocaleDateString()} </div>  
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
                <p style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{offer.title}</p>
                <p style={{ fontSize: '1rem', marginBottom: '20px' }}>{offer.description}</p>
                <div style={{ borderTop: '1px solid #fff9e6', paddingTop: '10px', marginBottom: '10px' }}>
                    <p style={{ fontSize: '.85rem', marginBottom: '10px' }}>While we build out messaging, we recommend reaching out to the user via their social links below!</p>
                    {currentUser?.socials.map((social, index) => (
                        <p key={index} style={{ fontSize: '0.9rem' }}>{social.name}: {social.value}</p>
                    ))}
                    {/* map over users socials isnt working i dont thinls its trying to map over the right object  */}
                </div>
                { offer &&
                    <div className={styles.layoutFavoriteButton}>
                        <FavoriteButton itemId={offer?.id} itemType="ask" />
                    </div>
                }
                </div>
            </div>
        </div>
    )
}

export default DisplayOfferModal