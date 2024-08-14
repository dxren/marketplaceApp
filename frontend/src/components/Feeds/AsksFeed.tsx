import { useEffect, useState } from "react"
import { useAskService } from "../../services/askService"
import { Ask } from "../../../../shared/types"


function AsksFeed() {
    const [asks, setAsks] = useState<Ask[]>([])
    const askService = useAskService();
    // const { getAsks, createAskForCurrentUser } = useAskService();


    //fetch the feed of asks on page load (useEffect)
    useEffect(() => {
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
        fetchAsks()
    }, [])

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

    return (
        //map them on to the page 
        <>
            <div style={{ backgroundColor: "blue" }}>
                <div>
                    {asks.map((asks) => (
                        <div key={asks.id}>
                            <p>{asks.description}</p>
                            <p>{asks.user.displayName}</p>
                            <p>Created at: {new Date(asks.createdAt).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
                <div>
                    <button onClick={createAsk}>Create Ask</button>
                </div>
            </div>
        </>
    )
}

export default AsksFeed