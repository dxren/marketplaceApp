import { Pencil } from "lucide-react";
import { LocalUserStore } from "./localUserStore";
import styles from './styles.module.css';
import { useState } from "react";
import { useUserService } from "../../services/userService";

enum Mode {View, Edit};

interface UserDetailsProps {
    userStore: LocalUserStore;
    canEdit: boolean;
}
function UserDetails(props: UserDetailsProps) {
    const [mode, setMode] = useState<Mode>(Mode.View);
    console.log(props.userStore.localUser);
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
    const user = props.userStore.localUser;
    const {canEdit, setMode} = props;

    return (
        <div className={styles.userDetails}>
            <div className={styles.displayName}>
                <span className={styles.shimmer}>
                    {user?.displayName}
                </span>
                {canEdit && <Pencil color='white' onClick={() => setMode(Mode.Edit)}></Pencil>}
            </div>
            <div>Joined on {user?.createdAt.toLocaleDateString('en-US')}</div>
            <div>About me:</div>
            <div>{user?.biography}</div>
        </div>
    )
}

function UserDetailsEditMode(props: UserDetailsModeProps) {
    const user = props.userStore.localUser;
    const {setMode} = props;
    const [displayName, setDisplayName] = useState<string>(user?.displayName ?? '');
    const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatarUrl ?? '');
    const [biography, setBiography] = useState<string>(user?.biography ?? '');
    const userService = useUserService();

    const saveChanges = () => {
        userService.updateCurrentUser({displayName, avatarUrl, biography});
        setMode(Mode.View);
    }

    return (
        <div className={styles.userDetails}>
            <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Display Name" />
            <input value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="Avatar URL" />
            <input value={biography} onChange={e => setBiography(e.target.value)} placeholder="About me..." />
            <div className={styles.controlRow}>
                <button onClick={() => setMode(Mode.View)}>Cancel</button>
                <button onClick={saveChanges}>Save Changes</button>
            </div>
        </div>
    )
}

export default UserDetails;