import { useAuth } from "@clerk/clerk-react";
import { Post } from "../../../shared/types";
import {
  parseDateStringsA,
  deleteAuthed,
  getAuthed,
  getRequest,
  postAuthed,
  putAuthed,
} from "./utils";
import { ENDPOINTS_POST } from "./endpoints";
import {
  CreatePostBody,
  CreatePostResponse,
  DeletePostResponse,
  GetManyPostResponse,
  GetOnePostResponse,
  GetManyOptions,
  UpdatePostBody,
  UpdatePostResponse,
  FavoritePostResponse,
} from "../../../shared/apiTypes";
import { IAppStore, useAppStore } from "../appStore";
import { parseDateStrings } from "./utils";
import { IUserService, useUserService } from "./userService";

export interface IPostService {
  fetchPostsByCurrentUser(options?: GetManyOptions): Promise<void>;
  fetchPostsByUser(id: string, options?: GetManyOptions): Promise<void>;
  getPostById(id: string): Promise<Post | null>;
  createPostForCurrentUser(bodyObj: CreatePostBody): Promise<Post | null>;
  updatePostForCurrentUser(
    id: string,
    bodyObj: UpdatePostBody
  ): Promise<Post | null>;
  deletePostForCurrentUser(id: string): Promise<Post | null>;
  fetchPosts(options?: GetManyOptions): Promise<void>;
  fetchFavoritePostsByCurrentUser(options?: GetManyOptions): Promise<void>;
  addFavoritePost(id: string): Promise<boolean>;
  removeFavoritePost(id: string): Promise<boolean>;
}

const PostService = (
  getToken: () => Promise<string>,
  appStore: IAppStore,
  userService: IUserService
): IPostService => ({
  fetchPostsByCurrentUser: async (options) => {
    const url = ENDPOINTS_POST.GET_MANY_BY_CURRENT_USER;
    const token = await getToken();
    const response = await getAuthed<GetManyPostResponse>(url, token, options);
    if (!response) return;
    const posts = parseDateStringsA(response.posts);
    appStore.setPosts(posts);
    appStore.setCount({ posts: response.count });
  },
  fetchPostsByUser: async (id, options) => {
    const url = ENDPOINTS_POST.GET_MANY_BY_USER(id);
    const response = await getRequest<GetManyPostResponse>(url, options);
    if (!response) return;
    const posts = parseDateStringsA(response.posts);
    appStore.setPosts(posts);
    appStore.setCount({ posts: response.count });
  },
  getPostById: async (id) => {
    const url = ENDPOINTS_POST.GET_ONE(id);
    const token = await getToken();
    const response = await getAuthed<GetOnePostResponse>(url, token);
    if (!response) return null;
    const post = parseDateStrings(response);
    return post;
  },
  createPostForCurrentUser: async (bodyObj) => {
    const url = ENDPOINTS_POST.CREATE;
    const token = await getToken();
    const response = await postAuthed<CreatePostResponse>(url, token, bodyObj);
    if (!response) return null;
    const post = parseDateStrings(response);
    PostService(getToken, appStore, userService).fetchPosts();
    userService.fetchCurrentUser();
    return post;
  },
  updatePostForCurrentUser: async (id, bodyObj) => {
    const url = ENDPOINTS_POST.UPDATE(id);
    const token = await getToken();
    const response = await putAuthed<UpdatePostResponse>(url, token, bodyObj);
    if (!response) return null;
    const post = parseDateStrings(response);
    PostService(getToken, appStore, userService).fetchPosts();
    userService.fetchCurrentUser();
    return post;
  },
  deletePostForCurrentUser: async (id) => {
    const url = ENDPOINTS_POST.DELETE(id);
    const token = await getToken();
    const response = await deleteAuthed<DeletePostResponse>(url, token);
    if (!response) return null;
    const post = parseDateStrings(response);
    PostService(getToken, appStore, userService).fetchPosts();
    userService.fetchCurrentUser();
    return post;
  },
  fetchPosts: async (options) => {
    const url = ENDPOINTS_POST.GET_MANY;
    const response = await getRequest<GetManyPostResponse>(url, options);
    if (!response) return;
    const posts = parseDateStringsA(response.posts);
    if (!posts) return;
    appStore.setPosts(posts);
    appStore.setCount({ posts: response.count });
  },
  fetchFavoritePostsByCurrentUser: async (options) => {
    const url = ENDPOINTS_POST.GET_FAVORITED_BY_CURRENT_USER;
    const token = await getToken();
    const response = await getAuthed<GetManyPostResponse>(url, token, options);
    if (!response) return;
    const posts = parseDateStringsA(response.posts);
    appStore.setFavoritePosts(posts);
    appStore.setCount({favoritePosts: response.count});
  },
  addFavoritePost: async (id) => {
    if (!appStore.currentUser) {
        console.error('Current user has not been fetched.');
        return false;
    }
    const url = ENDPOINTS_POST.ADD_FAVORITE(id);
    const token = await getToken();

    const originalUser = structuredClone(appStore.currentUser);
    const optimisticUser = structuredClone(appStore.currentUser);
    optimisticUser.favoritePosts = [...optimisticUser.favoritePosts, id];
    appStore.setCurrentUser(optimisticUser);

    const response = await postAuthed<FavoritePostResponse>(url, token, {});
    if (!response) appStore.setCurrentUser(originalUser);
    PostService(getToken, appStore, userService).fetchFavoritePostsByCurrentUser();
    return Boolean(response);
  },
  removeFavoritePost: async (id) => {
    if (!appStore.currentUser) {
        console.error('Current user has not been fetched.');
        return false;
    }
    const url = ENDPOINTS_POST.REMOVE_FAVORITE(id);
    const token = await getToken();

    const originalUser = structuredClone(appStore.currentUser);
    const optimisticUser = structuredClone(appStore.currentUser);
    optimisticUser.favoritePosts = optimisticUser.favoritePosts.filter(postId => postId !== id);
    appStore.setCurrentUser(optimisticUser);
    
    const response = await deleteAuthed<FavoritePostResponse>(url, token);
    if (!response) appStore.setCurrentUser(originalUser);
    PostService(getToken, appStore, userService).fetchFavoritePostsByCurrentUser();
    return Boolean(response);
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
