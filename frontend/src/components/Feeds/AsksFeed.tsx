import { useEffect, useState } from "react"
import { useAskService } from "../../services/askService"
import AsksModal from "../Modals/AsksModal";
import { useAppStore } from "../../appStore";


function AsksFeed() {
    const {asks} = useAppStore();
    const {fetchAsks} = useAskService();
    const [showModal, setShowModal] = useState(false)

    //fetch the feed of asks on page load (useEffect)
    useEffect(() => {
        fetchAsks()
    }, []);

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
                    {asks.map((ask) => (
                        <div key={ask.id}>
                            <p>{ask.title}</p>
                            <p>{ask.description}</p>
                            <p>{ask.user.displayName}</p>
                            <p>Created at: {new Date(ask.createdAt).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
                <div>
                    <button onClick={handleOpenModal}>Create New Ask</button>
                    <AsksModal isOpen={showModal} onClose={handleCloseModal} />
                </div>
            </div>
        </>
    )
}

export default AsksFeed