import { Link } from "react-router-dom";
import UserInfo from "../components/UserInfo/UserInfo";
import { user } from "../../../shared/examples";

export default function OtherProfilePage() {
    return (
        <>
            <UserInfo />
            <Link to={`/profile/${user.id}`}>Return to index</Link>
        </>
    )
}