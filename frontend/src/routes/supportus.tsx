import { Link } from "react-router-dom";

export default function SupportUsPage() {
    return (
        <>
            <h1>This is the Support Us page, eventually will be stripe checkout page</h1>
            <p>This is a protected page</p>
            <ul>
                <li><Link to="/">Return to index</Link></li>
            </ul>
        </>
    )
}