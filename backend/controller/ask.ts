import { Router } from 'express';
import { AskService } from '../service/ask';
import { getUserIdOrError } from './utils';
import { CreateAskBody, CreateAskResponse, DeleteAskResponse, GetManyAskResponse, GetOneAskResponse, UpdateAskBody, UpdateAskResponse } from '../../shared/apiTypes';
import { CreateAskParams, UpdateAskParams } from '../types';

export const askRouter = Router();

// GET_ALL
askRouter.get('/', async (req, res) => {
    const {error} = getUserIdOrError(req, res);
    if (error) return;
    const result: GetManyAskResponse = await AskService().getAll();
    res.json(result);
});

// GET_ONE
askRouter.get('/:id', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const id = req.params.id;
    const result: GetOneAskResponse | null = await AskService().getOne(id);
    if (!result) {
        res.status(404).end();
        return;
    }
    if (result.user.id !== userId) {
        res.status(501).end();
        return;
    }
    res.json(result);
});

// GET_ALL_BY_CURRENT_USER
askRouter.get('/user', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const result: GetManyAskResponse | null = await AskService().getAllByUser(userId);
    if (!result) {
        res.status(404).end();
        return;
    }
    res.json(result);
});

// GET_ALL_BY_USER
askRouter.get('/user/:id', async (req, res) => {
    const id = req.params.id;
    const result: GetManyAskResponse | null = await AskService().getAllByUser(id);
    if (!result) {
        res.status(404).end();
        return;
    }
    res.json(result);
});

// CREATE
askRouter.post('/', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const body = req.body as Partial<CreateAskBody>;
    const description = body.description;
    if (!description) {
        res.status(400).end();
        return;
    }
    const data: CreateAskParams = {
        description,
        userId
    }
    const result: CreateAskResponse = await AskService().create(data);
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

    const result: DeleteAskResponse | null = await AskService().delete(id);
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
        description: body.description
    };
    const result: UpdateAskResponse | null = await AskService().update(id, data);
    return result;
})