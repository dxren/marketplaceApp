import styles from "./styles.module.css";

interface CodeofConductModalProps {
    onButtonClick: () => void
}

function CodeofConductModal({ onButtonClick }: CodeofConductModalProps) {

    const handleCloseModal = () => {
        try {
            onButtonClick()
        }
        catch (error) {
            console.error(error)
            throw error
        }
    }

    return (
        <div className={styles.codeofConductModalBackground}>
            <div className={styles.codeofConductModal}>
                <div className={styles.addAskOfferModalTitle}>Code of Conduct</div>
                <div className={styles.codeofConductInput}>Hey there! Welcome to Fractal Marketplace. To keep things running smoothly, here's what we expect from everyone:</div>
                <ul>
                    <li><strong>Be Cool:</strong> Treat others how you'd want to be treated. No bullying, harassment, or general bad behavior.</li>
                    <li><strong>Keep It Real:</strong> Be honest about your skills and what you're looking for. No fake profiles or scams.</li>
                    <li><strong>No Spamming:</strong> Share your skills, but don't flood the site with repetitive posts or ads.</li>
                    <li><strong>Keep It Legal:</strong> Only offer and request services that are legal in your area.</li>
                </ul>
                <p style={{ paddingLeft: '20px' }}>If you see someone breaking these rules, <a href="mailto:dorothy.x.ren@gmail.com" style={{ color: '#FFFFFF' }}>let us know</a>.</p>
                <button onClick={handleCloseModal} className={styles.codeofConductModalCreateButton}>I understand</button>
            </div>
        </div>
    );
}

export default CodeofConductModal;