import { useAppStore } from "../../appStore"

interface CommentFeedProps {
    postId: string;
}

export function CommentFeed({ postId }: CommentFeedProps) {
    const { comments } = useAppStore()

    if (!comments) {
        return <div>Loading comments...</div>;
    }
    //identify the ask/offer
    //filter the comments based on that ask/offer id 
    const filteredComments = comments.filter((comments) => comments.parentId === postId)

    //display the comments associated with that ask/offer

    return (
        <>
            <h1 style={{ backgroundColor: 'pink' }}>Comments</h1>
            <div >
                {filteredComments.map((comment) =>
                    <>
                        <p>{comment.content}</p>
                        <p>{new Date(comment.createdAt).toLocaleString()}</p>
                        <p>{comment.user.displayName}</p>
                    </>
                )}
            </div>
        </>
    )
}
