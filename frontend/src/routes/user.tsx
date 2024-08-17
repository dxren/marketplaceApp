import { useParams } from 'react-router-dom';
import UserInfo from '../components/UserInfo/UserInfo';

export default function UserPage() {
    const { userId } = useParams<{ userId: string }>();
    return <UserInfo userId={userId || null} />;
}