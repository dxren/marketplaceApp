import { useParams, useNavigate } from 'react-router-dom';
import DisplayPostModal from '../components/Modals/DisplayPostModal';

const DisplayPostModalRoute = () => {
    const { postId } = useParams();
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/posts');
    };

    return <DisplayPostModal id={postId ?? ''} onClose={handleClose} />;
};

export default DisplayPostModalRoute;