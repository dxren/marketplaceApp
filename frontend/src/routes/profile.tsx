import { Link } from "react-router-dom";
import UserInfo from "../components/UserInfoOld/UserInfo";

export default function ProfilePage() {
    return (
        <>
            <UserInfo userId={null} />
            <li><Link to="/">Return to index</Link></li>
    
        </>
    )
}
