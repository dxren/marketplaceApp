import { AskOfferComment } from "../../../shared/types";
import { getAuthed, deleteAuthed, postAuthed, putAuthed } from "./utils";
import { ENDPOINTS_COMMENTS } from "./endpoints";
import {
  CreateCommentResponse,
  GetManyCommentResponse,
  UpdateCommentResponse,
  DeleteCommentResponse,
  CommentType,
} from "../../../shared/apiTypes";
import { IAppStore, useAppStore } from "../appStore";
import { parseDateStrings, parseDateStringsA } from "./utils";
import { useAuth } from "@clerk/clerk-react";

export interface ICommentService {
  fetchCommentsByParentType(
    id: string,
    type: CommentType
  ): Promise<AskOfferComment[] | null>;
  createCommentByCurrentUser(bodyObj: {
    comment: string;
    parentType: CommentType;
    parentId: string;
  }): Promise<AskOfferComment | null>;
  updateCommentByCurrentUser(
    id: string,
    bodyObj: { comment?: string; parentType: CommentType; parentId: string }
  ): Promise<AskOfferComment | null>;
  deleteCommentByCurrentUser(
    id: string,
    bodyObj: { comment?: string; parentType: CommentType; parentId: string }
  ): Promise<AskOfferComment | null>;
}

export const CommentService = (
  getToken: () => Promise<string>,
  appStore: IAppStore
): ICommentService => ({
  fetchCommentsByParentType: async (id, type) => {
    const url = ENDPOINTS_COMMENTS.GET_ALL_BY_PARENTTYPE(id, type);
    const token = await getToken();
    const response = await getAuthed<GetManyCommentResponse>(url, token);
    if (!response) return null;
    const comments = parseDateStringsA(response.comments);
    appStore.setComments(comments);
    appStore.setCount({ comments: response.count });
    return comments;
  },
  createCommentByCurrentUser: async (bodyObj) => {
    const url = ENDPOINTS_COMMENTS.CREATE;
    const token = await getToken();
    //store the current state of the comments array in memory (structured clone)
    const currentComments = structuredClone(appStore.comments);
    // create the optimistic comment
    const newOptimisticComment: AskOfferComment = {
      id: "",
      content: bodyObj.comment,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    //without waiting for the server, assume this succeeds and add the new comment to the local store
    appStore.setComments([...currentComments, newOptimisticComment]);
    //ship off the new comment to the server, add it to the db
    //when the promise resolves, in the event the response is a failure, revert to structured clone (delete new comment)
    const response = await postAuthed<CreateCommentResponse>(
      url,
      token,
      bodyObj
    );
    if (!response) {
      appStore.setComments(currentComments);
      return null;
    }
    //in the event it succeeds, trigger entire refresh to capture all new comments
    CommentService(getToken, appStore).fetchCommentsByParentType(
      bodyObj.parentId,
      bodyObj.parentType
    );
    return parseDateStrings(response);
  },
  updateCommentByCurrentUser: async (id, bodyObj) => {
    const url = ENDPOINTS_COMMENTS.UPDATE(id);
    const token = await getToken();
    const currentComments = structuredClone(appStore.comments);
    const updatedOptimisticComment: AskOfferComment = {
      id: id,
      content: bodyObj.comment ?? "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    appStore.setComments([...currentComments, updatedOptimisticComment]);
    const response = await putAuthed<UpdateCommentResponse>(
      url,
      token,
      bodyObj
    );
    if (!response) {
      appStore.setComments(currentComments);
      return null;
    }
    CommentService(getToken, appStore).fetchCommentsByParentType(
      bodyObj.parentId,
      bodyObj.parentType
    );
    return parseDateStrings(response);
  },
  deleteCommentByCurrentUser: async (id, bodyObj) => {
    const url = ENDPOINTS_COMMENTS.DELETE(id);
    const token = await getToken();
    const currentComments = structuredClone(appStore.comments);
    const deletedOptimisticComment: AskOfferComment = {
      id: id,
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const tempOptimisticArray = currentComments.filter(
      (comment) => comment.id !== deletedOptimisticComment.id
    );
    appStore.setComments(tempOptimisticArray);
    const response = await deleteAuthed<DeleteCommentResponse>(url, token);
    if (!response) {
      appStore.setComments(currentComments);
      return null;
    }
    CommentService(getToken, appStore).fetchCommentsByParentType(
      bodyObj.parentId,
      bodyObj.parentType
    );
    return parseDateStrings(response);
  },
});

export const useCommentService = (): ICommentService => {
  const { getToken } = useAuth();
  const appStore = useAppStore();

  const getTokenOrThrow = async () => {
    const token = await getToken();
    if (!token) throw new Error("Unable to fetch Clerk token.");
    return token;
  };

  const commentService = CommentService(getTokenOrThrow, appStore);
  return commentService;
};
