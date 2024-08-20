import { useState } from "react";
import MiniFeed from "../components/Feeds/MiniFeed";
import CodeofConductModal from "../components/Modals/CodeofConductModal";

export default function IndexPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => { setIsModalOpen(true) }
    const closeModal = () => { setIsModalOpen(false) }

    return (
        <div>
            <div style={{
                height: '100vh',
                overflowY: 'auto',
                background: 'linear-gradient(347deg in oklab, rgb(0% 92% 99% / 70%) -15% -15%, rgb(84% 0% 55% / 71%) 132% 132%)',
                fontFamily: 'Brygada 1918',
                padding: '20px 30px',
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
                    Create a profile to start sharing your skills!
                </div>
                <div>
                    Check out our <a href="#" onClick={openModal} style={{ color: '#fff9e6', textDecoration: 'underline' }}>Code of Conduct</a> for how we expect our community members to treat each other.
                </div>
                <MiniFeed />
                {isModalOpen && <CodeofConductModal onButtonClick={closeModal} />}
            </div>
        </div>
    )
}