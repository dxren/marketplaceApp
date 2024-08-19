import { MinusCircle } from "lucide-react";
import styles from './styles.module.css';

export type LocalSocial = {
    id?: string;
    name: string;
    value: string;
};

type SocialsProps = {
    socials: LocalSocial[];
};
export function SocialsViewMode(props: SocialsProps) {
    if (!props.socials.length) return;
    return (
        <div className={styles.socials}>
            {props.socials.map((social, i) => 
                <div key={social.id || `social_${i}`} className={styles.socialsRow}>
                    <div>{social.name}</div>
                    <div>{social.value}</div>
                </div>
            )}
        </div>
    )
}

type SocialsEditProps = SocialsProps & {
    setSocials: React.Dispatch<React.SetStateAction<LocalSocial[]>>;
}
export function SocialsEditMode(props: SocialsEditProps) {
    const {socials, setSocials} = props;
    console.log(socials);

    const deleteSocial = (index: number) => {
        setSocials(prev => [...prev.slice(0, index), ...prev.slice(index + 1)]);
    }

    const addSocial = () => {
        setSocials(prev => [...prev, {name: '', value: ''}]);
    }

    const updateSocial = (index: number, data: {name?: string, value?: string}) => {
        setSocials(prev => prev.with(index, {id: prev[index].id, name: data.name ?? prev[index].name, value: data.value ?? prev[index].value}));
    }

    return (
        <div className={styles.socials}>
            {socials.map((social, i) => 
                <div key={social.id || `social_${i}`} className={styles.socialsRow}>
                    <input value={social.name} onChange={e => updateSocial(i, {name: e.target.value})} />
                    <input value={social.value} onChange={e => updateSocial(i, {value: e.target.value})} />
                    <MinusCircle onClick={() => deleteSocial(i)} />
                </div>
            )}
            <button onClick={() => addSocial()}>Add Social</button>
        </div>
    )
}