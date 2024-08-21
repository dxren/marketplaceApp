import { Router } from 'express';
import { AskService } from '../service/ask';
import { getUserIdOrError, parseGetManyOptions } from './utils';
import { CreateAskBody, GetManyOptions, UpdateAskBody } from '../../shared/apiTypes';
import { CreateAskParams, UpdateAskParams } from '../types';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { createUserFromAuth } from '../middleware/user';
import { Ask } from '../../shared/types';

export const askRouter = Router();

askRouter.use(ClerkExpressWithAuth(), createUserFromAuth());

// GET_MANY
askRouter.get('/', async (req, res) => {
    const options = parseGetManyOptions(req);
    const [asks, count] = await Promise.all([AskService().getMany(options), AskService().getCount()]);
    const result = {asks, count};
    res.json(result);
});

// GET_ONE
askRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    const result: Ask | null = await AskService().getOne(id);
    if (!result) {
        res.status(404).end();
        return;
    }
    res.json(result);
});

// GET_MANY_BY_CURRENT_USER
askRouter.get('/user', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const options = parseGetManyOptions(req);
    const [asks, count] = await Promise.all([AskService().getManyByUser(userId, options), AskService().getCount()]);
    if (!asks) {
        res.status(404).end();
        return;
    }
    const result = {asks, count};
    res.json(result);
});

// GET_MANY_BY_USER
askRouter.get('/user/:id', async (req, res) => {
    const id = req.params.id;
    const options = parseGetManyOptions(req);
    const [asks, count] = await Promise.all([AskService().getManyByUser(id, options), AskService().getCount()]);
    if (!asks) {
        res.status(404).end();
        return;
    }
    const result = {asks, count};
    res.json(result);
});

// CREATE
askRouter.post('/', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const body = req.body as Partial<CreateAskBody>;
    const {title, description} = body;
    if (!title) {
        res.status(400).end();
        return;
    }
    const data: CreateAskParams = {
        title,
        description,
        userId
    }
    const result: Ask = await AskService().create(data);
    res.json(result);
});

// DELETE
askRouter.delete('/:id', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const id = req.params.id;

    const toDelete = await AskService().getOne(id);
    const hasPermission = toDelete?.user.id === userId;
    if (!hasPermission) {
        res.status(401).end();
        return;
    }

    const result: Ask | null = await AskService().delete(id);
    if (!result) {
        res.status(400).end();
        return;
    }
    res.json(result);
});

// UPDATE
askRouter.put('/:id', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const id = req.params.id;

    const toUpdate = await AskService().getOne(id);
    const hasPermission = toUpdate?.user.id === userId;
    if (!hasPermission) {
        res.status(401).end();
        return;
    }

    const body = req.body as UpdateAskBody;
    const data: UpdateAskParams = {
        title: body.title,
        description: body.description
    };
    const result: Ask | null = await AskService().update(id, data);
    res.json(result);
});

// GET_FAVORITED_BY_USER
askRouter.get('/favoritedBy/:userId', async (req, res) => {
    const userId = req.params.userId;
    const options = parseGetManyOptions(req);
    const result = await AskService().getFavoritedByUser(userId, options);
});