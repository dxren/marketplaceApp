import { Link } from "react-router-dom";
import AsksFeed from "../components/Feeds/AsksFeed";

export default function AsksPage() {
    return (
        <>
            <h1>This will be the Asks feed</h1>
            <AsksFeed />
            <ul>
                <li><Link to="/">Return to index</Link></li>
            </ul>
        </>
    )
}