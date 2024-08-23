import { useState } from "react";
import MiniFeed from "../components/Feeds/MiniFeed";
import CodeofConductModal from "../components/Modals/CodeofConductModal";
import IndexText from "../components/TextBlocks/IndexPage";

export default function IndexPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => { setIsModalOpen(true) }
    const closeModal = () => { setIsModalOpen(false) }

    return (
        <div style={{
            height: '100vh',
            overflowY: 'auto',
            background: 'linear-gradient(347deg in oklab, rgb(0% 92% 99% / 70%) -15% -15%, rgb(84% 0% 55% / 71%) 132% 132%)',
            fontFamily: 'Brygada 1918',
            boxSizing: 'border-box',
            borderRadius: '10px',
            border: '1px outset #fff9e6'
        }}>
            <IndexText openModal={openModal} />
            <MiniFeed />
            {isModalOpen && <CodeofConductModal onButtonClick={closeModal} />}
        </div>
    )
}