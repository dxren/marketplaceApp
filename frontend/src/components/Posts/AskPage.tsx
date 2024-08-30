import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAskService } from "../../services/askService";
import { Ask } from "../../../../shared/types";
import { useUserService } from "../../services/userService";
import { useAppStore } from "../../appStore";
import { useAuth } from "@clerk/clerk-react";
import { DEFAULT_AVATAR_URL } from "../../constants";
import { Link, Heart } from "lucide-react";
import { MouseEvent } from "react";
import { CommentSection } from "../Comments/CommentSection";

const AskPage = () => {
    const { askId } = useParams();
    const { getAskById, addFavoriteAsk, removeFavoriteAsk } = useAskService();
    const { fetchUser } = useUserService();
    const [ask, setAsk] = useState<Ask>();
    const { fetchedUser } = useAppStore();
    const navigate = useNavigate();
    const { userId, isSignedIn } = useAuth();

    useEffect(() => {
        const fetchAsk = async () => {
            try {
                const fetchedAsk = (await getAskById(askId!)) ?? undefined;
                setAsk(fetchedAsk);
                if (fetchedAsk) {
                    fetchUser(fetchedAsk.user.id);
                }
            } catch (error) {
                console.error("Error fetching ask:", error);
            }
        };
        fetchAsk();
    }, [askId]);

    const handleUserClick = () => {
        if (userId && userId === ask?.user.id) {
            navigate('/profile');
        } else if (ask?.user.id) {
            navigate(`/user/${ask.user.id}`);
        }
    };

    const [showCopiedMessage, setShowCopiedMessage] = useState(false);

    const handleCopyLink = () => {
        const askLink = `${window.location.origin}/asks/${askId}`;
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

    const favoriteItemArray = fetchedUser?.favoriteAsks;
    const isFavorited = favoriteItemArray ? favoriteItemArray.some(id => id === askId) : false;

    const heartProps = isFavorited
        ? {
            color: '#f0c2d7',
            fill: '#e82c84',
            onClick: (e: MouseEvent) => { e.stopPropagation(); removeFavoriteAsk(askId!) },
        }
        : {
            color: '#ffffff',
            onClick: (e: MouseEvent) => { e.stopPropagation(); addFavoriteAsk(askId!) },
        };

    if (!ask) return null;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: 'Brygada 1918',
            background: 'linear-gradient(347deg in oklab, rgb(0% 92% 99% / 70%) -15% -15%, rgb(84% 0% 55% / 71%) 132% 132%)',
            height: '100vh',
            padding: '20px 20px 0 20px',
            boxSizing: 'border-box',
            borderRadius: '10px',
            border: '1px outset #fff9e6',
        }}>
            <div style={{
                maxWidth: '800px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                position: 'relative',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <img src={ask.user.avatarUrl || DEFAULT_AVATAR_URL} alt={ask.user.displayName} style={{ width: '48px', height: '48px', borderRadius: '100%', marginRight: '10px', cursor: 'pointer' }} onClick={handleUserClick} />
                    <span style={{ fontSize: '1.2rem', cursor: 'pointer' }} onClick={handleUserClick}>{ask.user.displayName}</span>
                    <div>•</div>
                    <div>{new Date(ask.createdAt).toLocaleDateString()}</div>
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
                <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '10px' }}>{ask.title}</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '10px', lineHeight: '1.6' }}>{ask.description}</p>
                {isSignedIn && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginBottom: '20px',
                    }}>
                        <Heart {...heartProps} size={24} />
                    </div>
                )}
                {fetchedUser?.socials && fetchedUser.socials.length > 0 && (
                    <div style={{ borderTop: '1px solid #fff9e6', paddingTop: '0px', marginBottom: '0px' }}>
                        <p style={{ fontSize: '1rem', marginBottom: '15px' }}>While we build out messaging, we recommend reaching out to the user via their social links below!</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            {fetchedUser?.socials.map((social, i) => {
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
            {askId && <CommentSection postId={askId} />}
        </div>
    );
};

export default AskPage;