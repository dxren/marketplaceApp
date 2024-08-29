import { useAuth } from "@clerk/clerk-react";
import { CreatePostResponseSchema, DeletePostResponseSchema, FavoritePostResponseSchema, GetFeedResponseSchema, GetManyPostResponseSchema, GetOnePostResponseSchema, Post, UpdatePostResponseSchema } from "../../../shared/apiTypes";
import {
  deleteAuthed,
  getAuthed,
  getRequest,
  postAuthed,
  putAuthed,
} from "./utils";
import { ENDPOINTS_POST } from "./endpoints";
import type {
  CreatePostBody,
  GetManyOptions,
  UpdatePostBody,
} from "../../../shared/apiTypes";
import { IAppStore, useAppStore } from "../appStore";
import { IUserService, useUserService } from "./userService";

export interface IPostService {
  fetchPostsByCurrentUser(options?: GetManyOptions): Promise<void>;
  fetchPostsByUser(id: string, options?: GetManyOptions): Promise<void>;
  getPostById(id: string): Promise<Post | null>;
  createPostForCurrentUser(bodyObj: CreatePostBody): Promise<void>;
  updatePostForCurrentUser(
    id: string,
    bodyObj: UpdatePostBody
  ): Promise<void>;
  deletePostForCurrentUser(id: string): Promise<void>;
  fetchFeed(options?: GetManyOptions): Promise<void>;
  fetchFavoritePostsByCurrentUser(options?: GetManyOptions): Promise<void>;
  addFavoritePost(post: Post): Promise<void>;
  removeFavoritePost(post: Post): Promise<void>;
}

const PostService = (
  getToken: () => Promise<string>,
  appStore: IAppStore,
  userService: IUserService
): IPostService => ({
  fetchPostsByCurrentUser: async (options) => {
    const url = ENDPOINTS_POST.GET_MANY_BY_CURRENT_USER;
    const token = await getToken();
    const response = await getAuthed(url, token, GetManyPostResponseSchema, options);
    if (!response) return;
    appStore.setPosts(response.posts);
    appStore.setCount({ posts: response.totalCount });
  },
  fetchPostsByUser: async (id, options) => {
    const url = ENDPOINTS_POST.GET_MANY_BY_USER(id);
    const response = await getRequest(url, GetManyPostResponseSchema, options);
    if (!response) return;
    appStore.setPosts(response.posts);
    appStore.setCount({ posts: response.totalCount });
  },
  getPostById: async (id) => {
    const foundPost = appStore.posts.find(x => x.id === id);
    if (foundPost) return foundPost;
    const url = ENDPOINTS_POST.GET_ONE(id);
    const token = await getToken();
    const post = await getAuthed(url, token, GetOnePostResponseSchema);
    if (!post) return null;
    return post;
  },
  createPostForCurrentUser: async (bodyObj) => {
    const url = ENDPOINTS_POST.CREATE;
    const token = await getToken();
    const post = await postAuthed(url, token, bodyObj, CreatePostResponseSchema);
    if (!post) return;
    // PostService(getToken, appStore, userService).fetchPosts();
  },
  updatePostForCurrentUser: async (id, bodyObj) => {
    const url = ENDPOINTS_POST.UPDATE(id);
    const token = await getToken();
    const post = await putAuthed(url, token, bodyObj, UpdatePostResponseSchema);
    if (!post) return;
    // PostService(getToken, appStore, userService).fetchPosts();
  },
  deletePostForCurrentUser: async (id) => {
    const url = ENDPOINTS_POST.DELETE(id);
    const token = await getToken();
    const post = await deleteAuthed(url, token, DeletePostResponseSchema);
    if (!post) return;
    // PostService(getToken, appStore, userService).fetchPosts();
  },
  fetchFeed: async (options) => {
    const url = ENDPOINTS_POST.GET_MANY;
    const response = await getRequest(url, GetFeedResponseSchema, options);
    if (!response) return;
    appStore.setPosts(response.posts);
    appStore.setCount({ posts: response.totalCount });
    appStore.setFetchedUsers(response.users);
  },
  fetchFavoritePostsByCurrentUser: async (options) => {
    const url = ENDPOINTS_POST.GET_FAVORITED_BY_CURRENT_USER;
    const token = await getToken();
    const response = await getAuthed(url, token, GetManyPostResponseSchema, options);
    if (!response) return;
    appStore.setFavoritePosts(response.posts);
    appStore.setCount({favoritePosts: response.totalCount});
  },
  addFavoritePost: async (post) => {
    if (!appStore.currentUser) {
        console.error('Current user has not been fetched.');
        return;
    }
    const url = ENDPOINTS_POST.ADD_FAVORITE(post.id);
    const token = await getToken();

    const originalFavorites = structuredClone(appStore.favoritePosts);
    const optimisticFavorites = [...originalFavorites, post]
    appStore.setFavoritePosts(optimisticFavorites);

    const response = await postAuthed(url, token, {}, FavoritePostResponseSchema);
    if (!response) appStore.setFavoritePosts(originalFavorites);
    PostService(getToken, appStore, userService).fetchFavoritePostsByCurrentUser();
  },
  removeFavoritePost: async (post) => {
    const url = ENDPOINTS_POST.REMOVE_FAVORITE(post.id);
    const token = await getToken();

    const originalFavorites = structuredClone(appStore.favoritePosts);
    const optimisticFavorites = originalFavorites.filter(x => x.id !== post.id);
    appStore.setFavoritePosts(optimisticFavorites);
    
    const response = await deleteAuthed(url, token, FavoritePostResponseSchema);
    if (!response) appStore.setFavoritePosts(originalFavorites);
    PostService(getToken, appStore, userService).fetchFavoritePostsByCurrentUser();
  },
});

export const usePostService = (): IPostService => {
  const { getToken } = useAuth();
  const appStore = useAppStore();
  const userSerivce = useUserService();

  const getTokenOrThrow = async () => {
    const token = await getToken();
    if (!token) throw new Error("Unable to fetch Clerk token.");
    return token;
  };

  const postService = PostService(getTokenOrThrow, appStore, userSerivce);
  return postService;
};
