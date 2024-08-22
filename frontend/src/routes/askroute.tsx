import { useParams, useNavigate } from 'react-router-dom';
import DisplayAskModal from '../components/Modals/DisplayAskModal';

const DisplayAskModalRoute = () => {
    const { askId } = useParams();
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/asks');
    };

    return <DisplayAskModal id={askId ?? ''} onClose={handleClose} />;
};

export default DisplayAskModalRoute;