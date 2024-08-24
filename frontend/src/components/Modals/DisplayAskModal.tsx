import { useEffect, useState } from "react";
import { useAskService } from "../../services/askService"
import { Ask } from "../../../../shared/types";
import { useUserService } from "../../services/userService";
import { useAppStore } from "../../appStore";
import styles from './styles.module.css';
import FavoriteButton from "../Common/FavoriteButton";
import Avatar from "../Common/Avatar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { X, Link } from "lucide-react";

interface DisplayAskModalProps {
    id: string
    onClose: () => void
}

const DisplayAskModal = ({ id, onClose }: DisplayAskModalProps) => {
    const { getAskById } = useAskService();
    const { fetchUser } = useUserService();
    const [ask, setAsk] = useState<Ask>()
    const { fetchedUser } = useAppStore();
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

    const [showCopiedMessage, setShowCopiedMessage] = useState(false);

    const handleCopyLink = () => {
        const askLink = `${window.location.origin}/asks/${id}`;
        navigator.clipboard.writeText(askLink).then(() => {
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

    if (!ask) return null;

    return (
        <div
            style={{
                backgroundColor: 'rgba(119, 136, 153, 0.9)',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 10,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    color: '#FFF9E6',
                    background: 'linear-gradient(347deg in oklab, rgb(0% 92% 99% / 70%) -15% -15%, rgb(84% 0% 55% / 71%) 132% 132%)',
                    width: '650px',
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
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                }}><X size={32} color='#fff9e6' /></button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '20px' }}>
                    <Avatar userId={ask.user.id} avatarUrl={ask?.user.avatarUrl} />
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
                        display: 'flex',
                        alignItems: 'center',
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
                                marginBottom: '10px',
                            }}>
                                Copied link!
                            </div>
                        )}
                        <button onClick={handleCopyLink} style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                        }}><Link size={24} color='#fff9e6' /></button>
                    </div>
                    <div className={styles.layoutFavoriteButton}>
                        <FavoriteButton itemId={ask.id} itemType="ask" />
                    </div>
                </div>
                <div className={styles.titleBar}>
                    <span style={{ fontSize: '1.8rem', marginBottom: '0px' }}>{ask.title}</span>
                </div>
                <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>{ask.description}</p>
                {fetchedUser?.socials && fetchedUser.socials.length > 0 && (
                    <div style={{ borderTop: '1px solid #fff9e6', paddingTop: '10px', marginBottom: '10px' }}>
                        <p style={{ fontSize: '.85rem', marginBottom: '10px' }}>While we build out messaging, we recommend reaching out to the user via their social links below!</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            {fetchedUser.socials.map((social, i) => {
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
    )
}

export default DisplayAskModal