import { Link } from "react-router-dom";

export default function OffersPage() {
    return (
        <>
            <h1>This will be the Offers feed</h1>
            <p>This is a protected page for now, but will not be in the future</p>
            <ul>
                <li><Link to="/">Return to index</Link></li>
            </ul>
        </>
    )
}