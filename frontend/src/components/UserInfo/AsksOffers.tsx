// import { useState } from 'react';
// import { useAppStore } from '../../appStore';
// import { usePostService } from '../../services/postService';
// import { useOfferService } from '../../services/offerService';
// import styles from './styles.module.css'
// import { PlusCircle } from 'lucide-react';
// import AddPostOfferModal from '../Modals/AddPostOfferModal';
// import Item, { EditablePostOffer } from './Item';


// type PostsOffersProps = {
//     isOwnProfile: boolean;
// }
// function PostsOffers(props: PostsOffersProps) {
//     const { currentUser, fetchedUser } = useAppStore();
//     const { updatePostForCurrentUser, deletePostForCurrentUser } = usePostService();
//     const { updateOfferForCurrentUser, deleteOfferForCurrentUser } = useOfferService();
//     const [showPostModal, setShowPostModal] = useState<boolean>(false);
//     const [showOfferModal, setShowOfferModal] = useState<boolean>(false);

//     const { isOwnProfile } = props;

//     const posts: EditablePostOffer[] = isOwnProfile ? (currentUser?.posts ?? []) : (fetchedUser?.posts ?? []);
//     const offers: EditablePostOffer[] = isOwnProfile ? (currentUser?.offers ?? []) : (fetchedUser?.offers ?? []);

//     const hasPosts = posts.length > 0;
//     const hasOffers = offers.length > 0;
//     const hasContent = hasPosts || hasOffers;

//     if (!isOwnProfile && !hasContent) {
//         return (
//             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#fff9e6' }}>
//                 This user hasn't added any posts or offers yet!
//             </div>
//         );
//     }

//     return (
//         <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', paddingRight: '20px', overflowY: 'auto'}}>
//             {(isOwnProfile || hasOffers) && (
//                 <div style={{ flex: 1 }}>
//                     <div style={{ display: 'flex', gap: '10px', fontSize: '1.75rem', fontWeight: '550', marginBottom: '10px' }}>
//                         <div> I am <span className={styles.shimmer}>offering</span>...</div>
//                         {isOwnProfile && <PlusCircle style={{ display: 'flex', alignItems: 'center' }} color='white' onClick={() => setShowOfferModal(true)} />}
//                     </div>
//                     <div>
//                         {offers.map((offer, i) => <Item
//                             key={offer.id ?? `offer_${i}`}
//                             item={offer}
//                             onChange={item => offer.id && updateOfferForCurrentUser(offer.id, item)}
//                             onDelete={() => offer.id && deleteOfferForCurrentUser(offer.id)}
//                             canEdit={isOwnProfile}
//                         />)}
//                     </div>
//                 </div>
//             )}

//             {(isOwnProfile || hasPosts) && (
//                 <div style={{ flex: 1 }}>
//                     <div style={{ display: 'flex', gap: '10px', fontSize: '1.75rem', fontWeight: '550', marginBottom: '10px' }}>
//                         <div> I am <span className={styles.shimmerReverse}>seeking</span>...</div>
//                         {isOwnProfile && <PlusCircle style={{ display: 'flex', alignItems: 'center' }} color='white' onClick={() => setShowPostModal(true)} />}
//                     </div>
//                     <div style={{ overflowY: 'auto' }}>
//                         {posts.map((post, i) => <Item
//                             key={post.id ?? `post_${i}`}
//                             item={post}
//                             onChange={item => post.id && updatePostForCurrentUser(post.id, item)}
//                             onDelete={() => post.id && deletePostForCurrentUser(post.id)}
//                             canEdit={isOwnProfile}
//                         />)}
//                     </div>
//                 </div>
//             )}
//             {showOfferModal && <AddPostOfferModal onClose={() => setShowOfferModal(false)} />}
//             {showPostModal && <AddPostOfferModal onClose={() => setShowPostModal(false)} />}
//         </div>
//     )
// }

// export default PostsOffers;