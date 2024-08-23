import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOfferService } from "../../services/offerService";
import { Offer } from "../../../../shared/types";
import { useUserService } from "../../services/userService";
import { useAppStore } from "../../appStore";
import { useAuth } from "@clerk/clerk-react";
import { DEFAULT_AVATAR_URL } from "../../constants";
import { Link } from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";

const OfferPage = ({ offer: propOffer, isModal = false, onClose }: { offer?: Offer, isModal?: boolean, onClose?: () => void }) => {
    const { offerId } = useParams();
    const { getOfferById } = useOfferService();
    const { fetchUser } = useUserService();
    const [offer, setOffer] = useState<Offer | undefined>(propOffer);
    const { currentUser } = useAppStore();
    const navigate = useNavigate();
    const { userId } = useAuth();
    const isMobile = useIsMobile();

    useEffect(() => {
        const fetchOffer = async () => {
            if (!propOffer && offerId) {
                try {
                    const fetchedOffer = await getOfferById(offerId);
                    setOffer(fetchedOffer);
                    if (fetchedOffer) {
                        fetchUser(fetchedOffer.user.id);
                    }
                } catch (error) {
                    console.error("Error fetching offer:", error);
                }
            }
        };
        fetchOffer();
    }, [offerId, propOffer]);

    const handleUserClick = () => {
        if (userId && userId === offer?.user.id) {
            navigate('/profile');
        } else if (offer?.user.id) {
            navigate(`/user/${offer.user.id}`);
        }
    };

    const flagColor = '#544bcc';
    const flagText = 'OFFERING';

    const [showCopiedMessage, setShowCopiedMessage] = useState(false);

    const handleCopyLink = () => {
        const offerLink = `${window.location.origin}/offers/${offerId}`;
        navigator.clipboard.writeText(offerLink).then(() => {
            setShowCopiedMessage(true);
            setTimeout(() => setShowCopiedMessage(false), 2000);
        }).catch((err) => {
            console.error('Failed to copy link: ', err);
        });
    };

    const getSocialLink = (name: string, value: string): string | null => {
        if (value.startsWith('http://') || value.startsWith('https://')) {
            return value;
        }

        const lowerName = name.toLowerCase();
        switch (lowerName) {
            case 'twitter':
            case 'x':
                return `https://twitter.com/${value.replace('@', '')}`;
            case 'instagram':
                return `https://instagram.com/${value.replace('@', '')}`;
            case 'facebook':
                return `https://facebook.com/${value}`;
            case 'linkedin':
                return `https://linkedin.com/in/${value}`;
            case 'github':
                return `https://github.com/${value}`;
            case 'venmo':
                return `https://venmo.com/${value.replace('@', '')}`;
            case 'paypal':
                return `https://paypal.me/${value}`;
            case 'calendly':
                return `https://calendly.com/${value}`;
            default:
                return null;
        }
    };

    if (!offer) return null;

    const content = (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: 'Brygada 1918',
            background: isModal ? 'none' : 'linear-gradient(347deg in oklab, rgb(0% 92% 99% / 70%) -15% -15%, rgb(84% 0% 55% / 71%) 132% 132%)',
            height: isModal ? 'auto' : '100vh',
            padding: '20px 20px 0 20px',
            boxSizing: 'border-box',
            borderRadius: isModal ? '0' : '10px',
            border: isModal ? 'none' : '1px outset #fff9e6',
        }}>
            <div style={{ 
                maxWidth: '800px', 
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <img src={offer.user.avatarUrl || DEFAULT_AVATAR_URL} alt={offer.user.displayName} style={{ width: '48px', height: '48px', borderRadius: '100%', marginRight: '10px', cursor: 'pointer' }} onClick={handleUserClick} />
                    <span style={{ fontSize: '1.2rem', cursor: 'pointer' }} onClick={handleUserClick}>{offer.user.displayName}</span>
                    <div>•</div>
                    <div>{new Date(offer.createdAt).toLocaleDateString()}</div>
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
                    }}>{flagText}</div>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        {showCopiedMessage && (
                            <div style={{
                                position: 'absolute',
                                bottom: '100%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                whiteSpace: 'nowrap',
                                color: '#fff9e6',
                                fontSize: '0.8rem',
                                animation: 'pulse-fade 2s ease-out',
                                marginBottom: '5px',
                            }}>
                                Copied link!
                            </div>
                        )}
                        <button onClick={handleCopyLink} style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',                    
                        }}><Link size={24} color='#fff9e6' /></button>
                    </div>
                </div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{offer.title}</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '30px', lineHeight: '1.6' }}>{offer.description}</p>
                {currentUser?.socials && currentUser.socials.length > 0 && (
                    <div style={{ borderTop: '1px solid #fff9e6', paddingTop: '20px', marginBottom: '20px' }}>
                        <p style={{ fontSize: '1rem', marginBottom: '15px' }}>While we build out messaging, we recommend reaching out to the user via their social links below!</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            {currentUser.socials.map((social, i) => {
                                const link = getSocialLink(social.name, social.value);
                                return (
                                    <div key={social.id || `social_${i}`} style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ marginRight: '10px', fontSize: '1rem', fontWeight: '650' }}>{social.name}</span>
                                        {link ? (
                                            <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: '#fff9e6', fontSize: '1rem', textDecoration: 'none', cursor: 'pointer' }}>
                                                {social.value}
                                            </a>
                                        ) : (
                                            <span style={{ fontSize: '1rem', fontWeight: '650' }}>{social.value}</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return isModal ? (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                maxWidth: '80%',
                maxHeight: '80%',
                overflow: 'auto',
            }}>
                {content}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    ) : content;
};

export default OfferPage;