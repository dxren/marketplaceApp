import { useParams } from 'react-router-dom';
import UserInfo from '../components/UserInfoOld/UserInfo';

export default function UserPage() {
    const { userId } = useParams<{ userId: string }>();
    return <UserInfo userId={userId || null} />;
}