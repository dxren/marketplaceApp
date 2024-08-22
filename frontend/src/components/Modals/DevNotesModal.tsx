import { useEffect, useState } from "react"
import { DevNote, getDevNotes } from "../../services/devNotes"

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
        <div>
            <h2>Developer Notes</h2>
            <ul>
                {notes.map((note) => (
                    <div>
                        <p>{note.content}</p>
                        <p>{note.date}</p>
                    </div>
                ))}
            </ul>
            <button onClick={handleCloseModal}>x</button>
        </div>
    )
}

export default DevNotesModal