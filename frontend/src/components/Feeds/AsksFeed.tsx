import { useEffect, useState } from "react"
import { useAskService } from "../../services/askService"
import AsksModal from "../Modals/AsksModal";
import { useAppStore } from "../../appStore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Ask } from "../../../../shared/types";
import { DEFAULT_AVATAR_URL } from "../../constants";

function PostItem({ item }: { item: Ask }) {
    const navigate = useNavigate();
    const { userId } = useAuth();

    const handleUserClick = () => {
        if (userId && userId === item.user.id) {
            navigate('/profile');
        } else {
            navigate(`/user/${item.user.id}`);
        }
    };

    const flagColor = '#ff6bb5';
    const flagText = 'SEEKING';

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            border: '1px solid #fff9e6',
            padding: '10px 35px',
            gap: '18px',
            marginBottom: '10px',
            borderRadius: '5px',
            color: '#fff9e6',
            position: 'relative',
            background: 'linear-gradient(to right, rgba(84, 0, 55, 0.2), rgba(199, 21, 133, 0.2))',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s ease',
            fontSize: '1.1rem',
        }}>
            <div style={{
                position: 'absolute',
                top: '10px',
                right: '18px',
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
            <img src={item.user?.avatarUrl || DEFAULT_AVATAR_URL} alt={item.user?.displayName || 'User'} style={{ width: '48px', height: '48px', borderRadius: '100%', flexShrink: 0, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.08)' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div onClick={handleUserClick}
                        style={{
                            cursor: 'pointer',
                            textDecoration: 'none',
                            color: '#e8e6e6',
                            fontSize: '1.2rem',
                        }}>{item.user.displayName}
                    </div>
                    <div style={{ color: "#e8e6e6" }}> •</div>
                    <div style={{ fontSize: '0.9rem', color: '#e8e6e6' }}>
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
                <div style={{ color: '#fff9e6', fontSize: '1.2rem', fontWeight: 'bold' }}>{item.title}</div>
                <div style={{ fontSize: '1rem', color: '#fff9e6' }}>{item.description}</div>
            </div>
        </div>
    );
}

function AsksFeed() {
    const { asks } = useAppStore();
    const { fetchAsks } = useAskService();
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false)
    const { isSignedIn } = useAuth();

    useEffect(() => {
        fetchAsks()
    }, []);

    const handleOpenModal = () => {
        if (isSignedIn) {
            setShowModal(true)
        }
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const filterAsks = (asks: Ask[]) => {
        return asks.filter((ask: Ask) =>
            ask.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ask.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }

    const filteredAsks = filterAsks(asks)

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(347deg in oklab, rgb(0% 92% 99% / 70%) -15% -15%, rgb(84% 0% 55% / 71%) 132% 132%)',
            fontFamily: 'Brygada 1918',
            padding: '12px 300px',
            boxSizing: 'border-box',
            borderRadius: '12px',
            border: '1px outset #fff9e6'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginLeft: '108px',
                marginRight: '0px',
                marginBottom: '6px',
                flexShrink: 0
            }}>
                <h1 style={{ color: "#fff9e6", fontSize: '1.8rem' }}>Asks</h1>
                <input type="text" placeholder="Search asks" onChange={(e) => setSearchTerm(e.target.value)} style={{
                    width: '240px',
                    padding: '12px',
                    borderRadius: '5px',
                    border: '2px solid #fff9e6',
                    backgroundColor: 'transparent',
                    color: '#fff9e6',
                    fontSize: '.85rem'
                }} />
            </div>
            <div style={{
                flexGrow: 1,
                overflowY: 'auto',
                marginBottom: '120px'
            }}>
                {filteredAsks.length > 0 ?
                    filteredAsks.map((ask: Ask) =>
                        <PostItem key={ask.id} item={ask} />)
                    : (
                        <p style={{ fontSize: '1.2rem' }}>No asks found</p>
                    )}
            </div>
            {isSignedIn && (<button
                onClick={handleOpenModal}
                style={{
                    position: 'fixed',
                    bottom: '36px',
                    right: '36px',
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    color: '#fff9e6',
                    fontSize: '36px',
                    backgroundColor: 'teal',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 3px 6px rgba(0,0,0,0.2)'
                }}
            >
                +
            </button>
            {isSignedIn && showModal && <AsksModal onClose={handleCloseModal} />}
        </div>
    )
}

export default AsksFeed