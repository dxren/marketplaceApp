import { useEffect, useState } from "react"
import { useAskService } from "../../services/askService"
import AsksModal from "../Modals/AsksModal";

import { useAppStore } from "../../appStore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Ask } from "../../../../shared/types";


function AskPost({ ask }: { ask: Ask }) {
    const navigate = useNavigate();
    const { userId } = useAuth();

    const handleUserClick = () => {
        console.log(ask.user.id)
        if (userId && userId === ask.user.id) {
            navigate('/profile')
        } else {
            navigate(`/user/${ask.user.id}`)
        }
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            border: '1px solid #fff9e6',
            padding: '10px 20px',
            gap: '20px',
            marginBottom: '10px',
            borderRadius: '4px',
            color: '#fff9e6',
        }}>
            <img src={ask.user?.avatarUrl || ''} alt={ask.user?.displayName || 'User'} style={{ width: '50px', height: '50px', borderRadius: '100%', backgroundColor: '#FFF9E6', flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div onClick={handleUserClick}
                    style={{
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        color: '#C71585'
                    }}>{ask.user.displayName}</div>
                <div style={{ color: '#C71585' }}>{ask.title}</div>
                <div>{ask.description}</div>
                <div style={{ fontSize: '12px' }}>posted {new Date(ask.createdAt).toLocaleString()}</div>
            </div>
        </div>
    )
}

function AsksFeed() {
    const { asks } = useAppStore();
    const { fetchAsks } = useAskService();
    const [searchTerm, setSearchTerm] = useState('');

    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        fetchAsks()
    }, []);

    const handleOpenModal = () => {
        setShowModal(true)
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
            overflowY: 'auto',
            background: 'linear-gradient(347deg in oklab, rgb(0% 92% 99% / 70%) -15% -15%, rgb(84% 0% 55% / 71%) 132% 132%)',
            fontFamily: 'Brygada 1918',
            padding: '20px',
            boxSizing: 'border-box',
            borderRadius: '10px',
            border: '1px outset #fff9e6'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1 style={{ color: "#C71585", textShadow: '0 0 6px #fff9e6' }}>Asks</h1>
                <input type="text" placeholder="Search asks" onChange={(e) => setSearchTerm(e.target.value)} style={{
                    width: '200px',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #3830a6',
                    backgroundColor: 'transparent',
                    color: '#3830a6'
                }} />
            </div>
            <div style={{ color: "#C71585" }}>
                {filteredAsks.length > 0 ?
                    filteredAsks.map((ask: Ask) =>
                        <AskPost key={ask.id} ask={ask} />)
                    : (
                        <p>No asks found</p>
                    )}
            </div>
            <button
                onClick={handleOpenModal}
                style={{
                    position: 'fixed',
                    bottom: '40px',
                    right: '40px',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    color: '#fff9e6',
                    fontSize: '40px',
                    backgroundColor: 'teal',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}
            >
                +
            </button>
            <AsksModal isOpen={showModal} onClose={handleCloseModal} />
        </div>
    )
}

export default AsksFeed