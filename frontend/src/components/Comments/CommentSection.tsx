import { useCommentService } from "../../services/commentService";
import { CommentFeed } from "../Feeds/CommentFeed";
import { useState } from "react";
import { CommentType } from "../../../../shared/apiTypes";

type CommentSectionProps = {
    postId: string
    parentType: CommentType
}

export function CommentSection(props: CommentSectionProps) {
    const { postId, parentType } = props
    const { createCommentByCurrentUser } = useCommentService()
    const [comment, setComment] = useState('')

    return (
        <>
            <CommentFeed postId={postId} />
            <input
                placeholder="Add your comment here...s"
                style={{
                    width: '100%',
                    padding: '10px',
                    margin: '10px 0',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    fontSize: '1rem'
                }}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <button
                style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
                onClick={() => createCommentByCurrentUser({ content: comment, parentId: postId, parentType: parentType })}
            >
                Enter
            </button>
        </>
    )
}

