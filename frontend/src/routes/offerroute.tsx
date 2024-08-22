import { useParams, useNavigate } from 'react-router-dom';
import DisplayOfferModal from '../components/Modals/DisplayOfferModal';

const DisplayOfferModalRoute = () => {
    const { offerId } = useParams();
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/offers');
    };

    return <DisplayOfferModal id={offerId ?? ''} onClose={handleClose} />;
};

export default DisplayOfferModalRoute;