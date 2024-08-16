import { useEffect, useState } from "react"
import { useAskService } from "../../services/askService"
import { Ask } from "../../../../shared/types"
import AsksModal from "../Modals/AsksModal";
import { useNavigate } from "react-router-dom";


function AskPost({ ask }: { ask: Ask }) {
    const navigate = useNavigate();

    const handleUserClick = () => {
        console.log(ask.user.id)
        navigate(`/user/${ask.user.id}`)
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
            <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '100%',
                backgroundColor: '#fff9e6',
                flexShrink: 0,
            }} />
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
    const askService = useAskService();
    const [asks, setAsks] = useState<Ask[]>([])
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        fetchAsks()
    }, [])

    const fetchAsks = async () => {
        try {
            const fetchedAsks = await askService.getAsks();
            if (fetchedAsks) {
                setAsks(fetchedAsks)
            }
        }
        catch (error) {
            console.error(error)
            throw error
        }
    }

    const handleOpenModal = () => {
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }
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
            <div>
                <h1 style={{ color: "#C71585", textShadow: '0 0 6px #fff9e6' }}>Asks</h1>
            </div>
            <div style={{ color: "#C71585" }}>
                {asks.map((ask) => (
                    <AskPost key={ask.id} ask={ask} />
                ))}
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
            <AsksModal fetchAsks={fetchAsks} isOpen={showModal} onClose={handleCloseModal} />
        </div>
    )
}

export default AsksFeed