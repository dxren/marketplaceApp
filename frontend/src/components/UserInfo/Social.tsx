import { Trash } from "lucide-react";
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
    if (!props.socials.length) return null;

    const getSocialLink = (name: string, value: string): string | null => {
        if (value.startsWith('http://') || value.startsWith('https://')) {
            return value;
        }

        const lowerName = name.toLowerCase();
        switch (lowerName) {
            case 'twitter':
            case 'x':
                return `https://twitter.com/${value.replace('@', '')}`;
            case 'instagram':
                return `https://instagram.com/${value.replace('@', '')}`;
            case 'facebook':
                return `https://facebook.com/${value}`;
            case 'linkedin':
                return `https://linkedin.com/in/${value}`;
            case 'github':
                return `https://github.com/${value}`;
            case 'venmo':
                return `https://venmo.com/${value.replace('@', '')}`;
            case 'paypal':
                return `https://paypal.me/${value}`;
            case 'calendly':
                return `https://calendly.com/${value}`;
            default:
                return null;
        }
    };

    return (
        <div className={styles.socials}>
            <div className={styles.socialNames}>
                {props.socials.map((social, i) => 
                    <div key={social.id || `social_name_${i}`} className={styles.socialName}>
                        {social.name}
                    </div>
                )}
            </div>
            <div className={styles.socialValues}>
                {props.socials.map((social, i) => {
                    const link = getSocialLink(social.name, social.value);
                    return (
                        <div key={social.id || `social_value_${i}`} className={styles.socialValue}>
                            {link ? (
                                <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: '#fff9e6' }}>
                                    {social.value}
                                </a>
                            ) : (
                                social.value
                            )}
                        </div>
                    );
                })}
            </div>
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

    const updateSocial = (index: number, data: {name?: string, value?: string}) => {
        setSocials(prev => prev.with(index, {id: prev[index].id, name: data.name ?? prev[index].name, value: data.value ?? prev[index].value}));
    }

    return (
        <div>
            {socials.map((social, i) => 
                <div key={social.id || `social_${i}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input 
                        value={social.name} 
                        onChange={e => updateSocial(i, {name: e.target.value})}
                        placeholder="Platform"
                        style={{
                            border: '1px solid #fff9e6',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            fontFamily: 'Brygada 1918, serif',
                            color: '#fff9e6',
                            flex: 1,
                        }}
                    />
                    <input 
                        value={social.value} 
                        onChange={e => updateSocial(i, {value: e.target.value})}
                        placeholder="Handle"
                        style={{
                            border: '1px solid #fff9e6',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            fontFamily: 'Brygada 1918, serif',
                            color: '#fff9e6',
                            flex: 2,
                        }}
                    />
                    <Trash onClick={() => deleteSocial(i)} style={{ cursor: 'pointer' }} />
                </div>
            )}
            
        </div>
    )
}