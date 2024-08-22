import { Pencil } from "lucide-react";
import styles from './styles.module.css';
import { useState } from "react";
import { useUserService } from "../../services/userService";
import { useAppStore } from "../../appStore";
import { LocalSocial, SocialsEditMode, SocialsViewMode } from "./Social";

enum Mode {View, Edit};

interface UserDetailsProps {
    canEdit: boolean;
}
function UserDetails(props: UserDetailsProps) {
    const [mode, setMode] = useState<Mode>(Mode.View);
    return (
        <>
            {mode === Mode.View && <UserDetailsViewMode {...props} mode={mode} setMode={setMode} />}
            {mode === Mode.Edit && <UserDetailsEditMode {...props} mode={mode} setMode={setMode} />}
        </>
    )
}

interface UserDetailsModeProps extends UserDetailsProps {
    mode: Mode;
    setMode: React.Dispatch<React.SetStateAction<Mode>>;
}

function UserDetailsViewMode(props: UserDetailsModeProps) {
    const user = useAppStore().currentUser;
    const {canEdit, setMode} = props;

    return (
        <div className={styles.userDetails}>
            <div className={styles.displayName}>
                <span className={styles.shimmer} style={{fontSize: '2.5rem', fontWeight: '600', marginRight: '10px'}}>
                    {user?.displayName}
                </span>
                {canEdit && <Pencil color='#fff9e6' onClick={() => setMode(Mode.Edit)}></Pencil>}
            </div>
            <div style={{fontSize: '.8rem'}}>joined on {user?.createdAt.toLocaleDateString('en-US')}</div>
            <div style={{fontSize: '1rem'}}>{user?.biography}</div>
            {user?.socials && <SocialsViewMode socials={user.socials} />}
        </div>
    )
}

function UserDetailsEditMode(props: UserDetailsModeProps) {
    const {currentUser: user} = useAppStore()
    const {setMode} = props;
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
                style={{fontSize: '2.5rem', fontWeight: '600'}}
            />
            <input
                value={avatarUrl}
                onChange={e => setAvatarUrl(e.target.value)}
                placeholder="Avatar URL"
                className={`${styles.input} ${styles.descriptionInput}`}
                style={{fontSize: '.8rem'}}
            />
            <textarea
                value={biography}
                onChange={e => setBiography(e.target.value)}
                placeholder="About me..."
                className={`${styles.input} ${styles.descriptionInput}`}
                style={{fontSize: '1rem'}}
            />
            <SocialsEditMode socials={socials} setSocials={setSocials} />
            <div style={{fontSize: ".75rem"}}> Social URLs and handles from supported sites will render as links </div> 
            <div className={styles.controlRow} style={{display: 'flex', justifyContent: 'flex-end', gap: '2px'}}>
                <button className={styles.userInfoFormCancel} onClick={() => setMode(Mode.View)}>Cancel</button>
                <button className={styles.userInfoFormSocial} onClick={() => addSocial()}>Add Social</button>
                <button className={styles.userInfoFormSave} onClick={saveChanges}>Save Changes</button>
            </div>
        </div>
    )
}

export default UserDetails;