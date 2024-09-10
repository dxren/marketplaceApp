import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { Router } from "express";
import { createUserFromAuth } from "../middleware/user";
import { getUserIdOrError } from "../controller/utils";
import { AskOfferComment } from "../../shared/types";
import { CommentService } from "../service/comment";
import { GetManyOptions } from "../../shared/apiTypes";
import { CreateCommentParams, UpdateCommentParams } from "../types";

export const commentRouter = Router();

commentRouter.use(ClerkExpressRequireAuth(), createUserFromAuth());

//GET_MANY - needs id, type
commentRouter.get("/:type/:id", async (req, res) => {
  const { id, type } = req.params;
  if (!id || !type) {
    return res.status(400).json({ error: "Missing id or type parameter" });
  }

  try {
    const comments = await CommentService().getManyByPost(id);
    res.json(comments);
  } catch (error) {
    console.error("Error retrieving comments:", error);
    res.status(500).json({ error: "Failed to retrieve comments" });
  }
});

//CREATE_COMMENT - needs bodyObj
commentRouter.post("/", async (req, res) => {
  const { userId, error } = getUserIdOrError(req, res);
  if (error) return;
  const { content, parentType, parentId } = req.body;

  if (!content || !parentType || !parentId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const commentData: CreateCommentParams = {
      content,
      userId,
      parentType,
      parentId,
    };
    const newComment = await CommentService().create(commentData);
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

//UPDATE_COMMENT - id, bodyObj
commentRouter.put("/:id", async (req, res) => {
  const { userId, error } = getUserIdOrError(req, res);
  const { id } = req.params;
  const content = req.body;

  if (!id || !content) {
    return res.status(400).json({ error: "Missing fields: id or content" });
  }
  if (error) return;
  try {
    const updateData: UpdateCommentParams = { content };
    const updatedComment = await CommentService().update(id, updateData);
    if (!updatedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Failed to update comment" });
  }
});

//DELETE_COMMENT- id, bodyObj
commentRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedComment = await CommentService().delete(id);
    if (!deletedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.json(deletedComment);
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});
