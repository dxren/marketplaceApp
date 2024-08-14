import { Link } from "react-router-dom";
import UserInfo from "../components/UserInfo/UserInfo";

export default function ProfilePage() {
    return (
        <>
            <UserInfo />
            <li><Link to="/">Return to index</Link></li>
    
        </>
    )
}