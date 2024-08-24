import { Pencil } from "lucide-react";
import styles from './styles.module.css';
import { useState } from "react";
import { useUserService } from "../../services/userService";
import { LocalSocial, SocialsEditMode, SocialsViewMode } from "./Social";
import { useAppStore } from "../../appStore";

enum Mode {View, Edit};

interface UserDetailsProps {
    isOwnProfile: boolean
}
function UserDetails(props: UserDetailsProps) {
    const [mode, setMode] = useState<Mode>(Mode.View);
    return (
        <>
            {mode === Mode.View && <UserDetailsViewMode {...props} setMode={setMode} />}
            {mode === Mode.Edit && <UserDetailsEditMode {...props} setMode={setMode} />}
        </>
    )
}

interface UserDetailsModeProps extends UserDetailsProps {
    setMode: React.Dispatch<React.SetStateAction<Mode>>;
}
function UserDetailsViewMode(props: UserDetailsModeProps) {
    const {isOwnProfile, setMode} = props;
    const {currentUser, fetchedUser} = useAppStore();
    
    const user = isOwnProfile ? currentUser : fetchedUser;

    return (
        <div className={styles.userDetails}>
            <div className={styles.displayName}>
                <span className={styles.shimmer}>
                    {user?.displayName}
                </span>
                {isOwnProfile && <Pencil color='#fff9e6' onClick={() => setMode(Mode.Edit)}></Pencil>}
            </div>
            <div className={styles.joinDate}>joined on {user?.createdAt.toLocaleDateString('en-US')}</div>
            <div className={styles.biography}>{user?.biography}</div>
            {user?.socials && <SocialsViewMode socials={user.socials} />}
        </div>
    )
}

function UserDetailsEditMode(props: UserDetailsModeProps) {
    const {isOwnProfile, setMode} = props;
    const {currentUser, fetchedUser} = useAppStore();

    const user = isOwnProfile ? currentUser : fetchedUser;

    const [displayName, setDisplayName] = useState<string>(user?.displayName ?? '');
    const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatarUrl ?? '');
    const [biography, setBiography] = useState<string>(user?.biography ?? '');
    const [socials, setSocials] = useState<LocalSocial[]>(user?.socials.map(social => ({id: social.id, name: social.name, value: social.value})) ?? []);
    const userService = useUserService();

    const saveChanges = () => {
        userService.updateCurrentUser({displayName, avatarUrl, biography, socials});
        setMode(Mode.View);
    }

    const addSocial = () => {
        setSocials(prev => [...prev, {name: '', value: ''}]);
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
            <input
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Display Name"
                className={`${styles.input} ${styles.titleInput}`}
            />
            <input
                value={avatarUrl}
                onChange={e => setAvatarUrl(e.target.value)}
                placeholder="Avatar URL"
                className={`${styles.input} ${styles.avatarInput}`}
            />
            <textarea
                value={biography}
                onChange={e => setBiography(e.target.value)}
                placeholder="About me..."
                className={`${styles.input} ${styles.biographyInput}`}
            />
            <SocialsEditMode socials={socials} setSocials={setSocials} />
            <div className={styles.socialInfo}>Social URLs and handles from supported sites will render as links</div> 
            <div className={styles.controlRow}>
                <button className={styles.userInfoFormCancel} onClick={() => setMode(Mode.View)}>Cancel</button>
                <button className={styles.userInfoFormSocial} onClick={() => addSocial()}>Add Social</button>
                <button className={styles.userInfoFormSave} onClick={saveChanges}>Save Changes</button>
            </div>
        </div>
    )
}

export default UserDetails;