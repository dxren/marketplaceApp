import { useState , useEffect} from 'react';

import { Pencil, PlusCircle, LucideTrash as Trash } from 'lucide-react';


import styles from './styles.module.css';
import editStyles from './editStyles.module.css';
import { Ask, Offer, User, Social  } from '../../../../shared/types';
import { useUserService } from '../../services/userService';



//TODO: add controlled inputs, make form real , make rows editable with enter submitting 
//make add offer/ask button work

// const mockUser = {
//   id: "user_123456789",
//   displayName: "hyperdiscogirl",
//   email: "hyperdisco@girl.com",
//   createdAt: new Date("2023-01-01T00:00:00Z"),
//   updatedAt: new Date("2023-03-15T12:30:00Z"),
//   socials: [
//     { id: "social_1", name: "Twitter", value: "@johndoe" },
//     { id: "social_2", name: "LinkedIn", value: "linkedin.com/in/johndoe" }
//   ],
//   asks: [
//     { id: "ask_1", description: "Looking for a UX design mentor", createdAt: new Date("2023-02-01T10:00:00Z"), updatedAt: new Date("2023-02-01T10:00:00Z"), isDeleted: false },
//     { id: "ask_2", description: "Seeking meditation group", createdAt: new Date("2023-03-01T14:00:00Z"), updatedAt: new Date("2023-03-01T14:00:00Z"), isDeleted: false }
//   ],
//   offers: [
//     { id: "offer_1", description: "Can teach firebreathing techniques", createdAt: new Date("2023-02-15T09:00:00Z"), updatedAt: new Date("2023-02-15T09:00:00Z"), isDeleted: false },
//     { id: "offer_2", description: "Available for yoga sessions", createdAt: new Date("2023-03-10T11:00:00Z"), updatedAt: new Date("2023-03-10T11:00:00Z"), isDeleted: false }
//   ]
// };

type Item = Omit<Ask | Offer, 'user'>;

function UserInfo() {
  const userService = useUserService();
  const [user, setUser] = useState<User | null>(null);
  const [editingUserInfo, setEditingUserInfo] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({ socials: [] });
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching user...");
        const currentUser = await userService.getCurrentUser();
        console.log("Current user fetched:", currentUser);
        setUser(currentUser);
        setEditedUser(currentUser || { socials: [] });
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  const toggleEdit = () => {
    setEditingUserInfo(!editingUserInfo);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editedUser) {
      try {
        const filteredSocials = editedUser.socials?.filter(social => social.name.trim() !== '' && social.value.trim() !== '') || [];

        const updatedUser = await userService.updateCurrentUser({
          ...editedUser,
          socials: filteredSocials,
          biography: editedUser.biography || '',
          avatarUrl: editedUser.avatarUrl || ''
        });


        if (updatedUser) {
          setUser(updatedUser);
          setEditedUser(updatedUser);
          toggleEdit();
        }
      } catch (error) {
        console.error("Failed to update user:", error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (index: number, field: keyof Social, value: string) => {
    setEditedUser(prev => {
      const updatedSocials = [...(prev.socials || [])];
      updatedSocials[index] = { ...updatedSocials[index], [field]: value };
      return { ...prev, socials: updatedSocials };
    });
  };

  const handleAddSocial = () => {
    if (!user) {
      console.error("User is not loaded yet.");
      return;
    }

    setEditedUser(prev => ({
      ...prev,
      socials: [
        ...(prev.socials || []),
        { id: `temp_${Date.now()}`, name: '', value: '' , user: user}
      ]
    }));
  };

  const handleDeleteSocial = (index: number) => {
    setEditedUser(prev => {
      const updatedSocials = [...(prev.socials || [])];
      updatedSocials.splice(index, 1);
      return { ...prev, socials: updatedSocials };
    });
  };

  const handleMouseEnter = (id: string) => {
    setHoveredItem(id);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const ItemWithHover = ({ item }: { item: Item, type: 'offer' | 'ask' }) => (
    <div
      className={styles.itemWithHover}
      onMouseEnter={() => handleMouseEnter(item.id)}
      onMouseLeave={handleMouseLeave}
    >
      {item.description}
      {hoveredItem === item.id && (
        <span className={styles.pencilSpan}>
          <Pencil size={16} />
        </span>
      )}
    </div>
  );

  return (
    <div className={styles.userInfo}>
      <div className={styles.userInfoRow}>
        {/* Row for user image and info */}
        <img src={user?.avatarUrl || ''} alt={user?.displayName || 'User'} className={styles.userInfoAvatar} />

        {/* Column for user info */}
        {editingUserInfo ? (
          <div className={editStyles.userInfoColumn}>
            <form onSubmit={handleSubmit} className={editStyles.userInfoForm}>
              <input
                type="text"
                name="displayName"
                value={editedUser.displayName || ''}
                className={editStyles.userInfoDisplayName}
                onChange={handleInputChange}
              />
              <input 
                type="text"
                name="avatarUrl"
                placeholder="Avatar URL"
                value={editedUser.avatarUrl || ''}
                className={editStyles.userInfoAvatar}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="biography"
                placeholder="About me"
                value={editedUser.biography || ''}
                className={editStyles.userInfoBiography}
                onChange={handleInputChange}
              />

              {editedUser?.socials?.map((social, index) => (
                <div key={index} className={editStyles.userInfoSocial}>
                  <input
                    type="text"
                    placeholder="Platform"
                    value={social.name}
                    onChange={e => handleSocialChange(index, 'name', e.target.value)}
                    className={editStyles.socialName}
                  />
                  <input
                    type="text"
                    placeholder="Handle"
                    value={social.value}
                    onChange={e => handleSocialChange(index, 'value', e.target.value)}
                    className={editStyles.socialValue}
                  />
                  <Trash
                    onClick={() => handleDeleteSocial(index)}
                    size={16}
                    className={editStyles.trashIcon}
                  />
                </div>
              ))}
              <div className={editStyles.userInfoFormContainer}>
                <button type="button" onClick={() => toggleEdit()} className={editStyles.userInfoFormCancel}>
                  Cancel
                </button>
                <button type="button" onClick={handleAddSocial} className={editStyles.userInfoFormSocial}>
                  Add Social
                </button>
                <button type="submit" className={editStyles.userInfoFormSave}>
                  Save Changes
                </button>
              </div>
            </form>
            {/* TODO: uhg i cant figure out how to align the buttons the way i want */}
            {/* <button className={editStyles.userInfoDeleteButton}>
              <X onClick={() => toggleEdit()} size={32} color="white" className={editStyles.userInfoDeleteSvg} />
            </button> */}
          </div>
        ) : (
          <div className={styles.userInfoColumn}>
            <div className={styles.userInfoList}>
              <div className={styles.userInfoName}>{user?.displayName}</div>
              <div>joined on {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</div>  
              <div> About me: {user?.biography} </div>             
                {user?.socials.map((social, index) => (

                <div key={index} className={styles.userInfoEntry}>
                  <div className={styles.socialName}>{social.name}</div>
                  <div className={styles.socialValue}>{social.value}</div>
                </div>
              ))}
            </div>
            <Pencil onClick={toggleEdit} size={32} color="white" className={styles.pencilLarge} />
          </div>
        )}
      </div>
      {/* Column for offers and asks */}
      <div className={styles.userInfoPosts}>
        <div className={styles.postsSection}>
          <div className={styles.postsSectionHeader}>
            I am <span className={styles.spanShimmer}>offering...</span>
            <PlusCircle />
          </div>
          {user?.offers?.map((offer) => (
            <ItemWithHover key={offer.id} item={offer} type="offer" />
          ))}
        </div>
        <div className={styles.postsSection}>
          <div className={styles.postsSectionHeader}>
            I am <span className={styles.spanShimmerReverse}>seeking...</span>
            <PlusCircle />
          </div>
          {user?.asks?.map((ask) => (
            <ItemWithHover key={ask.id} item={ask} type="ask" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserInfo;