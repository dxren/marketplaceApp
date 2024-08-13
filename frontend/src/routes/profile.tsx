import { Link } from "react-router-dom";

export default function ProfilePage() {
    return (
        <>
            <h1>This is the Profile page for a user</h1>
            <p>This is a protected page</p>
            <ul>
                <li><Link to="/">Return to index</Link></li>
            </ul>
        </>
    )
}