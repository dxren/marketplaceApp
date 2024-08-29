import { useAppStore } from "../../appStore"

export function Comments() {

    const { comments } = useAppStore()
    const { createCommentBYUser } = useCommentService()
    const onClick = async () => {

    }
    return (
        <>
            <h1 style={{ backgroundColor: 'pink' }}>Comments</h1>
        </>
    )
}