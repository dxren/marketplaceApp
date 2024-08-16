import { useState , useEffect} from 'react';
import { Pencil, PlusCircle, LucideTrash as Trash , Check, X} from 'lucide-react';
import styles from './styles.module.css';
import editStyles from './editStyles.module.css';
import { Ask, Offer, User, Social  } from '../../../../shared/types';
import { useUserService } from '../../services/userService';
import AddOfferModal from "../Modals/OffersModal";
import AddAskModal from "../Modals/AsksModal";
import { UpdateUserBody } from '../../../../shared/apiTypes';

type Item = Omit<Ask | Offer, 'user'>;

interface UserInfoProps {
  userId: string | null; // null means current user
}

function UserInfo({ userId }: UserInfoProps) {
  const userService = useUserService();
  const askService = useAskService();
  const offerService = useOfferService();
  const [user, setUser] = useState<User | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(userId === null);  
  const [editingUserInfo, setEditingUserInfo] = useState(false);
  const [editedUser, setEditedUser] = useState<UpdateUserBody>({ socials: [] });
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showAskModal, setShowAskModal] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editedItem, setEditedItem] = useState<Item | null>(null);
  const [shouldRefetch, setShouldRefetch] = useState(false);


  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        const fetchedUser = await userService.getUserById(userId);
        setUser(fetchedUser);
      } else {
        const currentUser = await userService.getCurrentUser();
        setUser(currentUser);
      }
      setShouldRefetch(false);
    };
    fetchUser();
  }, [userId, shouldRefetch]);

  const triggerRefetch = () => {
    setShouldRefetch(true);
  };

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

  const handleDeleteItem = async (itemId: string, isAsk: boolean) => {
    try {
      if (isAsk) {
        await askService.deleteAskForCurrentUser(itemId);
      } else {
        await offerService.deleteOfferForCurrentUser(itemId);
      }
      // Update local state after successful deletion
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          asks: isAsk ? prev.asks.filter(ask => ask.id !== itemId) : prev.asks,
          offers: !isAsk ? prev.offers.filter(offer => offer.id !== itemId) : prev.offers
        };
      });
    } catch (error) {
      console.error("Failed to delete item:", error);
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
        { name: '', value: ''}
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

  const handleEditItem = (item: Item) => {
    setEditingItem(item.id);
    setEditedItem(item);
  };



  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedItem(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSaveItem = async () => {
    if (!editedItem) return;
    try {
      if ('askType' in editedItem) {
        await useAskService().updateAskForCurrentUser(editedItem.id, editedItem);
      } else {
        await useOfferService().updateOfferForCurrentUser(editedItem.id, editedItem);
      }
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          asks: 'askType' in editedItem 
            ? prev.asks.map(ask => ask.id === editedItem.id ? {...ask, ...editedItem} : ask) 
            : prev.asks,
          offers: !('askType' in editedItem) 
            ? prev.offers.map(offer => offer.id === editedItem.id ? {...offer, ...editedItem} : offer) 
            : prev.offers
        };
      });
      setEditingItem(null);
      setEditedItem(null);
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  const Item = ({ item }: { item: Item }) => (
    <div className={styles.itemWithHover}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{item.title}</div>
        <div>{item.description}</div>
      </div>
    </div>
  );

  const ItemWithHover = ({ item, type }: { item: Item, type: 'ask' | 'offer' }) => (
    <div
      className={styles.itemWithHover}
      onMouseEnter={() => handleMouseEnter(item.id)}
      onMouseLeave={handleMouseLeave}
    >
      {editingItem === item.id ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <input
            name="title"
            value={editedItem?.title || ''}
            placeholder="Title"
            onChange={handleItemChange}
            className={styles.editInput}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={editedItem?.description || ''}
            onChange={handleItemChange}
            className={styles.editTextarea}
          />
          <div style={{ display: 'flex', flexDirection: 'row', gap: '2px' }}>
            <button onClick={handleSaveItem} className={styles.saveButton}><Check /></button>
            <button onClick={() => setEditingItem(null)} className={styles.cancelButton}><X /></button>
            <button onClick={() => handleDeleteItem(item.id, type === 'ask')} className={styles.cancelButton}><Trash /></button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{item.title}</div>
            <div>{item.description}</div>
          </div>
          {isOwnProfile && hoveredItem === item.id && (
            <span className={styles.pencilSpan} onClick={() => handleEditItem(item)}>
              <Pencil size={16} />
            </span>
          )}
        </>
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
            {isOwnProfile && <Pencil onClick={toggleEdit} size={32} color="white" className={styles.pencilLarge} />}
          </div>
        )}
      </div>
      {/* Column for offers and asks */}
      <div className={styles.userInfoPosts}>
        <div className={styles.postsSection}>
          <div className={styles.postsSectionHeader}>
            I am <span className={styles.spanShimmer}>offering...</span>
            {isOwnProfile && <PlusCircle  onClick={() => setShowOfferModal(true)} /> } 
          </div>
          {user?.offers?.map((offer) => (
            isOwnProfile ? (
              <ItemWithHover key={offer.id} item={offer} type="offer" />
            ) : (
              <Item key={offer.id} item={offer} />
            )
          ))}
        </div>
        <div className={styles.postsSection}>
          <div className={styles.postsSectionHeader}>
            I am <span className={styles.spanShimmerReverse}>seeking...</span>
            {isOwnProfile && <PlusCircle onClick={() => setShowAskModal(true)} /> }
          </div>
          {user?.asks?.map((ask) => (
            isOwnProfile ? (
              <ItemWithHover key={ask.id} item={ask} type="ask" />
            ) : (
              <Item key={ask.id} item={ask} />
            )
          ))}
        </div>
      </div>
      {showOfferModal && <AddOfferModal isOpen={showOfferModal} onClose={() => setShowOfferModal(false)} fetchOffers={() => console.log('fetch offers')} onOfferAdded={triggerRefetch} />}
 
      {showAskModal && <AddAskModal isOpen={showAskModal} onClose={() => setShowAskModal(false)} fetchAsks={() => console.log('fetch asks')} onAskAdded={triggerRefetch} />}
    </div>
  
  );
}

export default UserInfo;