import { Pencil, Check, Trash, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import styles from './styles.module.css';

export type EditableAskOffer = {
    title: string;
    description: string;
    id?: string;
}
export type ItemProps = {
    item: EditableAskOffer;
    onChange(item: EditableAskOffer): void
    onDelete(): void
    canEdit: boolean;
}
function Item(props: ItemProps) {
    const [title, setTitle] = useState<string>(props.item.title);
    const [description, setDescription] = useState<string>(props.item.description);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const update = () => {
        props.onChange({ title, description });
        setIsEditing(false);
    }

    const cancel = () => {
        setTitle(props.item.title);
        setDescription(props.item.description)
        setIsEditing(false);
    }

    const updateTextAreaSize = () => {
        if (!textareaRef.current) return;
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }

    useEffect(() => updateTextAreaSize(), []);

    const updateDescription = (newDescription: string) => {
        setDescription(newDescription);
        updateTextAreaSize();
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '10px 15px',
            gap: '18px',
            border: '1px solid #fff9e6',
            marginBottom: '10px',
            borderRadius: '5px',
            color: '#fff9e6',
            position: 'relative',
            background: 'linear-gradient(to right, rgba(84, 0, 55, 0.2), rgba(199, 21, 133, 0.2))',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s ease',
            fontSize: '1.1rem',
        }}>
            <div style={{ display: 'flex', gap: '10px', flex: 1, justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div className={styles.titleText}>
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            disabled={!isEditing}
                            className={`${styles.editable} ${styles.titleInput} ${!isEditing ? styles.disabled : ''}`}
                        />
                    </div>
                    <div className={styles.descriptionText}>
                        <textarea
                            ref={textareaRef}
                            value={description}
                            onChange={e => updateDescription(e.target.value)}
                            disabled={!isEditing}
                            className={`${styles.editable} ${styles.descriptionInput} ${!isEditing ? styles.disabled : ''}`}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', minWidth: '32px' }}>
                    {props.canEdit && !isEditing &&
                        <Pencil color='#fff9e6' onClick={() => setIsEditing(prev => !prev)} />
                    }
                    {isEditing &&
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <Check size={32} color='#fff9e6' onClick={update} />
                            <Trash color='#fff9e6' onClick={props.onDelete} />
                            <X size={32} color='#fff9e6' onClick={cancel} />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Item;