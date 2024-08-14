import { useState , useEffect} from 'react';
import { Pencil, X, PlusCircle } from 'lucide-react';

import styles from './styles.module.css';
import editStyles from './editStyles.module.css';
import { Ask, Offer, User, Social  } from '../../../../shared/types';
import { useUserService } from '../../services/userService';


//TODO: add controlled inputs, make form real , make rows editable with enter submitting 
//make add offer/ask button work

const mockUser = {
  id: "user_123456789",
  displayName: "hyperdiscogirl",
  email: "hyperdisco@girl.com",
  createdAt: new Date("2023-01-01T00:00:00Z"),
  updatedAt: new Date("2023-03-15T12:30:00Z"),
  socials: [
      { id: "social_1", name: "Twitter", value: "@johndoe" },
      { id: "social_2", name: "LinkedIn", value: "linkedin.com/in/johndoe" }
    ],
    asks: [
        { id: "ask_1", description: "Looking for a UX design mentor", createdAt: new Date("2023-02-01T10:00:00Z"), updatedAt: new Date("2023-02-01T10:00:00Z"), isDeleted: false },
        { id: "ask_2", description: "Seeking meditation group", createdAt: new Date("2023-03-01T14:00:00Z"), updatedAt: new Date("2023-03-01T14:00:00Z"), isDeleted: false }
    ],
    offers: [
        { id: "offer_1", description: "Can teach firebreathing techniques", createdAt: new Date("2023-02-15T09:00:00Z"), updatedAt: new Date("2023-02-15T09:00:00Z"), isDeleted: false },
        { id: "offer_2", description: "Available for yoga sessions", createdAt: new Date("2023-03-10T11:00:00Z"), updatedAt: new Date("2023-03-10T11:00:00Z"), isDeleted: false }
    ]
};

type Item = Omit<Ask | Offer, 'user'>;

function UserInfo() {
  const userService = useUserService();
  const [user, setUser] = useState<User | null>(null);
  const [editingUserInfo, setEditingUserInfo] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching user...");
        const currentUser = await userService.getCurrentUser();
        console.log("Current user fetched:", currentUser);
        setUser(currentUser);
        setEditedUser(currentUser || {});
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
      const updatedUser = await userService.updateCurrentUser(editedUser);
      if (updatedUser) {
        setUser(updatedUser);
        toggleEdit();
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

  const handleMouseEnter = (id: string) => {
    setHoveredItem(id);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const ItemWithHover = ({ item, type }: { item: Item, type: 'offer' | 'ask' }) => (
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
        <img src="https://pbs.twimg.com/profile_images/1784843170108375040/b3NgH0mJ_400x400.jpg" alt="user" className={styles.userInfoAvatar} />
          {/* Column for user info */}
          {editingUserInfo ? (
             <div className={editStyles.userInfoColumn}>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="displayName"
                  value={editedUser.displayName || ''}
                  onChange={handleInputChange}
                />
                {editedUser.socials?.map((social, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      value={social.name}
                      onChange={(e) => handleSocialChange(index, 'name', e.target.value)}
                    />
                    <input
                      type="text"
                      value={social.value}
                      onChange={(e) => handleSocialChange(index, 'value', e.target.value)}
                    />
                  </div>
                ))}
                <button type="submit">Save All Changes</button>
                <button type="button" onClick={toggleEdit}>Cancel</button>
              </form>
               {/* TODO: uhg i cant figure out how to align the buttons the way i want */}
               <button className={editStyles.userInfoDeleteButton}>
                 <X onClick={() => toggleEdit()} size={32} color="white" className={editStyles.userInfoDeleteSvg} />
               </button>
             </div>
          ) : (
            <div className={styles.userInfoColumn}> 
              <div className={styles.userInfoList}>
              <div className={styles.userInfoName}>{user?.displayName}</div>
              <div> joined on {Date.now()}</div>
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