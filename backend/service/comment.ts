import type { AskOfferComment } from "../../shared/types";
import { CreateCommentParams, UpdateCommentParams } from "../types";
import { CommentType, GetManyOptions } from "../../shared/apiTypes";
import { prismaClient } from "../prismaClient";
import { DEFAULT_PAGE_LIMIT, PRISMA_SELECT_COMMENT } from "../constants";

export interface ICommentService {
  getManyByPost(
    id: string,
    options: GetManyOptions
  ): Promise<AskOfferComment[]>;
  create(data: CreateCommentParams): Promise<AskOfferComment>;
  update(
    id: string,
    params: UpdateCommentParams
  ): Promise<AskOfferComment | null>;
  delete(id: string): Promise<AskOfferComment | null>;
}

export const CommentService: () => ICommentService = () => ({
  getManyByPost: async (id, options) => {
    const { offset = 0, limit = DEFAULT_PAGE_LIMIT } = options;
    const result = await prismaClient.askOfferComment.findMany({
      where: { id },
      select: PRISMA_SELECT_COMMENT,
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    });
    const updatedResult = result.map((comment) => transformComment(comment));
    return updatedResult;
  },
  create: async (data) => {
    const { content, userId } = data;
    const body = { content, userId };
    const result = await prismaClient.askOfferComment.create({
      data: body,
      select: PRISMA_SELECT_COMMENT,
    });
    const updatedResult = transformComment(result);
    return updatedResult;
  },
  update: async (id, params) => {
    const { content } = params;
    const body = { content };
    const result = await prismaClient.askOfferComment.update({
      where: { id },
      data: body,
      select: PRISMA_SELECT_COMMENT,
    });
    const updatedComment = transformComment(result);
    return updatedComment;
  },
  delete: async (id) => {
    const deletedComment = await prismaClient.askOfferComment.delete({
      where: { id },
      select: PRISMA_SELECT_COMMENT,
    });
    return transformComment(deletedComment);
  },
});

// Merges askId, commentId, and offerId into parentId, and also adds a parentType
// This is because those fields do not exist in the database
const transformComment = (
  comment: Omit<
    AskOfferComment & {
      askId: string | null;
      commentId: string | null;
      offerId: string | null;
    },
    "parentType" | "parentId"
  >
) => {
  const parentId = comment.askId ?? comment.commentId ?? comment.offerId;
  if (!parentId) {
    throw new Error(`Malformatted database item: Comment ID ${comment.id}.`);
  }
  const parentType = (() => {
    if (comment.askId) return CommentType.Ask;
    if (comment.commentId) return CommentType.Comment;
    return CommentType.Offer;
  })();
  //strip out askId, offerId, and commentId, the result is assigned to the remaining object
  const { askId, commentId, offerId, ...rest } = comment;
  const updatedComment = { ...rest, parentId, parentType };
  return updatedComment;
};
