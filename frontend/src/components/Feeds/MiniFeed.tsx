import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useAppStore } from "../../appStore";
import { useAskService } from "../../services/askService";
import { useOfferService } from "../../services/offerService";
import { Ask, Offer } from "../../../../shared/types";
import { DEFAULT_AVATAR_URL } from "../../constants";

type FlaggedItem = (Ask | Offer) & { type: 'ask' | 'offer' };

function PostItem({ item }: { item: FlaggedItem }) {
    const navigate = useNavigate();
    const { userId } = useAuth();

    const handleUserClick = () => {
        if (userId && userId === item.user.id) {
            navigate('/profile');
        } else {
            navigate(`/user/${item.user.id}`);
        }
    };

    const flagColor = item.type === 'ask' ? '#ff6bb5' : '#544bcc';
    const flagText = item.type === 'ask' ? 'SEEKING' : 'OFFERING';

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            border: '1px solid #fff9e6',
            padding: '8px 30px',
            gap: '15px',
            marginBottom: '8px',
            borderRadius: '4px',
            minHeight: '60px',
            color: '#fff9e6',
            position: 'relative',
            background: 'linear-gradient(to right, rgba(84, 0, 55, 0.2), rgba(199, 21, 133, 0.2))',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s ease',
            fontSize: '0.9rem',
        }}>
            <div style={{
                position: 'absolute',
                top: '8px',
                right: '15px',
                padding: '2px 6px',
                borderRadius: '8px',
                backgroundColor: flagColor,
                color: '#fff9e6',
                fontFamily: 'sans-serif',
                fontSize: '0.7rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                background: `linear-gradient(135deg, ${flagColor}, ${flagColor}cc)`,
                border: `1px solid ${flagColor}33`,
                textShadow: '0 1px 1px rgba(0,0,0,0.1)',
                zIndex: 1,
            }}>{flagText}</div>
            <img onClick={handleUserClick} src={item.user?.avatarUrl || DEFAULT_AVATAR_URL} alt={item.user?.displayName || 'User'} style={{ width: '40px', height: '40px', borderRadius: '100%', flexShrink: 0, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.08)' , cursor: 'pointer' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center'}}> 
                    <div onClick={handleUserClick}
                        style={{
                            cursor: 'pointer',
                            textDecoration: 'none',
                            color: '#e8e6e6',
                            fontSize: '1rem',
                        }}>{item.user.displayName}
                        </div>
                        <div style={{color: "#e8e6e6"}}> •</div>
                        <div style={{ fontSize: '0.75rem', color: '#e8e6e6' }}>
                        {(() => {
                            const now = new Date();
                            const createdAt = new Date(item.createdAt);
                            const diffInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / 60000);

                            if (diffInMinutes < 60) {
                                return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
                            } else if (diffInMinutes < 1440) {
                                const hours = Math.floor(diffInMinutes / 60);
                                return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
                            } else {
                                return createdAt.toLocaleDateString('en-US', { 
                                    month: '2-digit', 
                                    day: '2-digit', 
                                    year: 'numeric' 
                                });
                            }
                        })()}
                    </div>
                </div>
                <div style={{ color: '#fff9e6', fontSize: '1rem' , fontWeight: 'bold' }}>{item.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#fff9e6' }}>{item.description}</div>

            </div>
        </div>
    );
}

export default function MiniFeed() {
    const { asks, offers } = useAppStore();
    const { fetchAsks } = useAskService();
    const { fetchOffers } = useOfferService();

    useEffect(() => {
        fetchAsks();
        fetchOffers();
    }, []);

    const sortedAsks: FlaggedItem[] = asks.map(ask => ({ ...ask, type: 'ask' as const }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const sortedOffers: FlaggedItem[] = offers.map(offer => ({ ...offer, type: 'offer' as const }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div style={{ margin: '30px 30px' }}>
            <h1 style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '20px' }}>Latest Activity</h1>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '15px',
                color: "#C71585", 
            }}>
                <div>
                    {sortedAsks.slice(0, 5).map((item) => (
                        <PostItem key={item.id} item={item} />
                    ))}
                </div>
                <div>
                    {sortedOffers.slice(0, 5).map((item) => (
                        <PostItem key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}