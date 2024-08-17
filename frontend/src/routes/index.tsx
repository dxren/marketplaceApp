import { Link } from "react-router-dom";
import MiniFeed from "../components/Feeds/MiniFeed";

export default function IndexPage() {
    return (
        <div style={{
            height: '100vh',
            overflowY: 'auto',
            background: 'linear-gradient(347deg in oklab, rgb(0% 92% 99% / 70%) -15% -15%, rgb(84% 0% 55% / 71%) 132% 132%)',
            fontFamily: 'Brygada 1918',
            padding: '20px',
            boxSizing: 'border-box',
            borderRadius: '10px',
            border: '1px outset #fff9e6'
        }}>
            <div style={{
                fontSize: '2rem',
                fontWeight: 'semibold',
                color: '#fff9e6',
                marginBottom: '20px'
            }}>
                Welcome to Fractal Marketplace!
            </div>
            <div style={{
                fontSize: '1.2rem',
                color: '#fff9e6',
                marginBottom: '20px'
            }}>
                Create a profile or sign in with Google to start sharing your skills!
            </div>
            <MiniFeed />
        </div>
    )
}