import { CommentFeed } from "../Feeds/CommentFeed";

type CommentSectionProps = {
    postId: string
}

export function CommentSection(props: CommentSectionProps) {
    const { postId } = props
    return (
        <>
            <CommentFeed postId={postId} />
            <input placeholder="Add a comment" />
            <button> Enter </button>
        </>
    )
}

