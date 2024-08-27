import { useEffect, useState } from "react"
import { usePostService } from "../../services/postService"
import AddPostOfferModal from "../Modals/AddPostOfferModal";
import { useAppStore } from "../../appStore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Post } from "../../../../shared/types";

import styles from './styles.module.css';
import postStyles from './postsStyles.module.css';
import PageNavigator from "./PageNavigator";
import DisplayPostModal from "../Modals/DisplayPostModal";
import FavoriteButton from "../Common/FavoriteButton";
import { getTimestampString } from "../../utils";
import Avatar from "../Common/Avatar";
import { useIsMobile } from "../../hooks/useIsMobile";
import { Search } from "lucide-react";

function PostItem({ item }: { item: Post }) { 
    const navigate = useNavigate();
    const { userId } = useAuth();
    const [showModal, setShowModal] = useState(false)
    const isMobile = useIsMobile();

    const handlePostClick = () => {
        if (isMobile) {
            navigate(`/posts/${item.id}`);
        } else {
            setShowModal(true);
        }
    }

    const handleUserClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        if (userId && userId === item.user.id) {
            navigate('/profile');
        } else {
            navigate(`/user/${item.user.id}`);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const flagColor = '#ff6bb5';
    const flagText = 'SEEKING';

    return (
        <>
            <div className={postStyles.postItem} onClick={handlePostClick}>
                <div
                    className={postStyles.flag}
                    style={{
                        backgroundColor: flagColor,
                        background: `linear-gradient(135deg, ${flagColor}, ${flagColor}cc)`,
                        border: `1px solid ${flagColor}33`,
                    }}
                >
                    {flagText}
                </div>

                <Avatar userId={item.user.id} avatarUrl={item.user.avatarUrl} />
                <div className={postStyles.content}>
                    <div className={postStyles.userInfo}>
                        <div className={postStyles.userName} onClick={(e) => handleUserClick(e)}>
                            {item.user.displayName}
                        </div>
                        <div className={postStyles.separator}>•</div>
                        <div className={postStyles.timestamp}>
                            {getTimestampString(item.createdAt)}
                        </div>
                    </div>
                    <div className={postStyles.postTitle} >{item.title}</div>
                    <div className={postStyles.description}>{item.description}</div>
                </div>
                <div className={postStyles.layoutFavoriteButton}>
                    <FavoriteButton itemId={item.id} itemType="post" />
                </div>
            </div>
            <div className={postStyles.mobilePostItem} onClick={handlePostClick}>
                <div
                    className={postStyles.flag}
                    style={{
                        backgroundColor: flagColor,
                        background: `linear-gradient(135deg, ${flagColor}, ${flagColor}cc)`,
                        border: `1px solid ${flagColor}33`,
                    }}
                >
                    {flagText}
                </div>
                <div className={postStyles.mobileUserInfo}>
                    <Avatar userId={userId} />
                    <div>
                        <div className={postStyles.userName} onClick={(e) => handleUserClick(e)}>
                            {item.user.displayName}
                        </div>
                        <div className={postStyles.timestamp}>
                            {(() => {
                                const now = new Date();
                                const createdAt = new Date(item.createdAt);
                                const diffInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / 60000);

                                if (diffInMinutes < 60) {
                                    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
                                } else if (diffInMinutes < 1440) {
                                    const hours = Math.floor(diffInMinutes / 60);
                                    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
                                } else {
                                    return createdAt.toLocaleDateString('en-US', {
                                        month: '2-digit',
                                        day: '2-digit',
                                        year: 'numeric'
                                    });
                                }
                            })()}
                        </div>
                    </div>
                </div>
                <div className={postStyles.postTitle} >{item.title}</div>
                <div className={postStyles.description}>{item.description}</div>
            </div>
            {showModal && <DisplayPostModal id={item.id} onClose={handleCloseModal} />}
        </>
    );
}

function PostsFeed() {
    const { posts, postCount } = useAppStore();
    const { fetchPosts } = usePostService();
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false)
    const { isSignedIn } = useAuth();
    const [page, setPage] = useState<number>(1);
    const RESULTS_PER_PAGE = 10;

    useEffect(() => {
        fetchPosts({ limit: RESULTS_PER_PAGE, offset: (page - 1) * RESULTS_PER_PAGE });
    }, [page]);

    const handleOpenModal = () => {
        if (isSignedIn) {
            setShowModal(true)
        }
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const fetchWithSearch = () => {
        const searchString = searchTerm.trim();
        fetchPosts({searchString});
    }

    return (
        <div className={postStyles.container} >
            <div className={postStyles.header}>
                <h1 className={postStyles.title}>Posts</h1>
                <div className={styles.searchBar}>
                    <input
                        type="text"
                        placeholder="Search posts"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={e => {if (e.key === 'Enter') fetchWithSearch()}}
                        className={postStyles.searchInput}
                    />
                    <button className={styles.searchButton} onClick={fetchWithSearch}><Search color='white' /></button>
                </div>
            </div>
            <div className={postStyles.postsList}>
                {posts.length > 0 ?
                    posts.map((post: Post) =>
                        <PostItem key={post.id} item={post} />)
                    : (
                        <p className={postStyles.noPostsFound}>No posts found</p>
                    )}
            </div>
            {posts.length > 0 && (
                <PageNavigator page={page} setPage={setPage} maxPage={Math.ceil(postCount / RESULTS_PER_PAGE)} />
            )}
            {isSignedIn && (
                <button
                    onClick={handleOpenModal}
                    className={postStyles.addButton}
                >
                    +
                </button>
            )}
            {showModal && <AddPostOfferModal onClose={handleCloseModal} />}
        </div>
    )
}

export default PostsFeed