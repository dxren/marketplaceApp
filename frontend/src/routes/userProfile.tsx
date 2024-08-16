import { Link } from "react-router-dom";
import UserInfo from "../components/UserInfo/UserInfo";
//TODO: Add a reroute for when the user accesses their own profile/:userId

export default function ProfilePage() {
    return (
        <>
            <UserInfo />
            <li><Link to="/">Return to index</Link></li>
        </>
    )
}