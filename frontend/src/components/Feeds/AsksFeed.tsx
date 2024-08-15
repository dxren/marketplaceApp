import { useEffect, useState } from "react"
import { useAskService } from "../../services/askService"
import { Ask } from "../../../../shared/types"
import AsksModal from "../Modals/AsksModal";


function AsksFeed() {
    const [asks, setAsks] = useState<Ask[]>([])
    const askService = useAskService();
    const [showModal, setShowModal] = useState(false)

    //fetch the feed of asks on page load (useEffect)
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
    //handle way to create a new ask
    const createAsk = async () => {
        try {
            const newAsk = await askService.createAskForCurrentUser("test description");
            if (newAsk) {
                setAsks([...asks, newAsk])
            }
        }
        catch (error) {
            console.error(error)
            throw error
        }
    }

    //add a create Ask button that will display the offersModal component on click
    const handleOpenModal = () => {
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    return (
        //map them on to the page 
        <>
            <div style={{ backgroundColor: "blue" }}>
                <div>
                    {asks.map((asks) => (
                        <div key={asks.id}>
                            <p>{asks.title}</p>
                            <p>{asks.description}</p>
                            <p>{asks.user.displayName}</p>
                            <p>Created at: {new Date(asks.createdAt).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
                <div>
                    <button onClick={handleOpenModal}>Create New Ask</button>
                    <AsksModal fetchAsks={fetchAsks} isOpen={showModal} onClose={handleCloseModal} />
                </div>
            </div>
        </>
    )
}

export default AsksFeed