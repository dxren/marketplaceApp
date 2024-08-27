import { Router } from 'express';
import { PostService } from '../service/post';
import { getUserIdOrError, parseGetManyOptions } from './utils';
import { CreatePostBody, CreatePostBodySchema, CreatePostResponseSchema, DeletePostResponseSchema, FavoritePostResponseSchema, GetManyPostResponseSchema, GetOnePostResponse, GetOnePostResponseSchema, UpdatePostBody, UpdatePostBodySchema, UpdatePostResponseSchema } from '../../shared/apiTypes';
import { CreatePostParams, UpdatePostParams } from '../types';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { createUserFromAuth } from '../middleware/user';
import { validateRequestBody } from 'zod-express-middleware';

export const postRouter = Router();

postRouter.use(ClerkExpressWithAuth(), createUserFromAuth());

// GET_MANY
postRouter.get('/', async (req, res) => {
    const options = parseGetManyOptions(req);
    const [posts, totalCount] = await Promise.all([PostService().getMany(options), PostService().getCount()]);
    const result = GetManyPostResponseSchema.parse({posts, totalCount});
    res.json(result);
});

// GET_FAVORITED_BY_CURRENT_USER
postRouter.get('/favoritedBy', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const options = parseGetManyOptions(req);
    const [posts, totalCount] = await Promise.all([
        PostService().getFavoritedByUser(userId, options),
        PostService().getFavoritedByCount(userId)
    ]);
    const result = GetManyPostResponseSchema.parse({posts, totalCount});
    res.json(result);
});

// GET_MANY_BY_CURRENT_USER
postRouter.get('/user', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const options = parseGetManyOptions(req);
    const [posts, totalCount] = await Promise.all([PostService().getManyByUser(userId, options), PostService().getCount()]);
    if (!posts) {
        res.status(404).end();
        return;
    }
    const result = GetManyPostResponseSchema.parse({posts, totalCount});
    res.json(result);
});

// GET_MANY_BY_USER
postRouter.get('/user/:id', async (req, res) => {
    const id = req.params.id;
    const options = parseGetManyOptions(req);
    const [posts, totalCount] = await Promise.all([PostService().getManyByUser(id, options), PostService().getCount()]);
    if (!posts) {
        res.status(404).end();
        return;
    }
    const result = GetManyPostResponseSchema.parse({posts, totalCount});
    res.json(result);
});

// GET_ONE
postRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    const result = GetOnePostResponseSchema.parse(await PostService().getOne(id));
    if (!result) {
        res.status(404).end();
        return;
    }
    res.json(result);
});

// CREATE
postRouter.post('/', validateRequestBody(CreatePostBodySchema), async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const body = req.body;
    const {title, description} = body;
    if (!title) {
        res.status(400).end();
        return;
    }
    const data: CreatePostParams = {
        title,
        description,
        userId
    }
    const result = CreatePostResponseSchema.parse(await PostService().create(data));
    res.json(result);
});

// DELETE
postRouter.delete('/:id', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const id = req.params.id;

    const toDelete = await PostService().getOne(id);
    const hasPermission = toDelete?.userId === userId;
    if (!hasPermission) {
        res.status(401).end();
        return;
    }

    const deleted = await PostService().delete(id);
    if (!deleted) {
        res.status(400).end();
        return;
    }
    const result = DeletePostResponseSchema.parse(deleted);
    res.json(result);
});

// UPDATE
postRouter.put('/:id', validateRequestBody(UpdatePostBodySchema), async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const id = req.params.id;

    const toUpdate = await PostService().getOne(id);
    const hasPermission = toUpdate?.userId === userId;
    if (!hasPermission) {
        res.status(401).end();
        return;
    }

    const body = req.body;
    const data: UpdatePostParams = {
        title: body.title,
        description: body.description
    };
    const result = UpdatePostResponseSchema.parse(await PostService().update(id, data));
    res.json(result);
});

// ADD_FAVORITE
postRouter.post('/favorite/:postId', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const postId = req.params.postId;
    const result = await FavoritePostResponseSchema.parse(PostService().addFavorite(postId, userId));
    if (!result) {
        res.status(404).end();
        return;
    }
    res.json(result);
});

// REMOVE_FAVORITE
postRouter.delete('/favorite/:postId', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const postId = req.params.postId;
    const result = await PostService().removeFavorite(postId, userId);
    if (!result) {
        res.status(404).end();
        return;
    }
    res.json(result);
});