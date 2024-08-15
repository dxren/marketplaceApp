import { useEffect, useState } from "react"
import { useOfferService } from "../../services/offerService"
import { Offer } from "../../../../shared/types";


function OffersFeed() {
    const offerService = useOfferService();
    const [offers, setOffers] = useState<Offer[]>([])

    //useEffect to fetch the feed of offers on page load
    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const fetchedOffers = await offerService.getOffers();
                if (fetchedOffers) {
                    setOffers(fetchedOffers)
                }
            }
            catch (error) {
                console.error(error)
                throw error
            }
        }
        fetchOffers()
    }, [])

    return (
        <>
            <div style={{ backgroundColor: "#E75480" }}>
                {offers.map((offer) => (
                    <div key={offer.id}>
                        <p>{offer.description}</p>
                        <p>{offer.user.displayName}</p>
                        <p>Created at: {new Date(offer.createdAt).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default OffersFeed