import { Link } from "react-router-dom";

export default function IndexPage() {
    return (
        <div>
            <h1>This is the index page</h1>
            <div>
                <ul>
                    <li><Link to="/sign-up">Sign Up</Link></li>
                    <li><Link to="/sign-in">Sign In</Link></li>
                    <li><Link to="/offers">Offers</Link></li>
                    <li><Link to="/asks">Asks</Link></li>
                    <li><Link to="/profile">Person 1 Profile Page</Link></li>
                    <li><Link to="/supportus">Support Us</Link></li>
                </ul>
            </div>
        </div>
    )
}