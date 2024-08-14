import { Link } from "react-router-dom";
import OffersFeed from "../components/Feeds/OffersFeed";

export default function OffersPage() {
    return (
        <>
            <h1>This will be the Offers feed</h1>
            <OffersFeed />
            <ul>
                <li><Link to="/">Return to index</Link></li>
            </ul >
        </>
    )
}

