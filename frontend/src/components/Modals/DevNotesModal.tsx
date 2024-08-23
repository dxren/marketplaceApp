import { useEffect, useState } from "react"
import { DevNote, getDevNotes } from "../../services/devNotes"
import styles from "./styles.module.css"

interface DevNotesProps {
    onButtonClick: () => void
}
function DevNotesModal({ onButtonClick }: DevNotesProps) {
    const [notes, setNotes] = useState<DevNote[]>([])

    useEffect(() => {
        setNotes(getDevNotes())
    }, [])

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
        <div className={styles.askModalBackground}>
            <div className={styles.codeofConductModal}>
                <div className={styles.askModalTitle}>Dev Notes</div>
                <div className={styles.codeofConductInput} >
                    <ul>
                        {notes.map((note) => (
                            <div key={note.date}>
                                <p><u>{note.date}</u></p>
                                <p>{note.content}</p>
                            </div>
                        ))}
                    </ul>
                </div>
                <button onClick={handleCloseModal} className={styles.askModalCloseButton}>x</button>
            </div>
        </div>
    )
}

export default DevNotesModal