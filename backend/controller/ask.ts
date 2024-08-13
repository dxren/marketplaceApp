import { Router } from 'express';
import { AskService } from '../service/ask/service';
import { getUserIdOrError, stripId } from './utils';
import { CreateAskBody, CreateAskResponse, DeleteAskResponse, GetManyAskResponse, GetOneAskResponse, UpdateAskBody, UpdateAskResponse } from '../../shared/apiTypes';
import { Prisma } from '@prisma/client';
import { Unchecked } from '../types';

export const askRouter = Router();

const askService = AskService();

askRouter.get('/', async (req, res) => {
    const {error} = getUserIdOrError(req, res);
    if (error) return;
    const result: GetManyAskResponse = await askService.getAll();
    res.json(result);
});

askRouter.get('/:id', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    userId;
    const id = req.params.id;
    const result: GetOneAskResponse | null = await askService.getOne(id);
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

askRouter.post('/', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const body = req.body as Unchecked<CreateAskBody>;
    const description = body.description;
    if (!description) {
        res.status(400).end();
        return;
    }
    const data: Prisma.AskUncheckedCreateInput = {
        description,
        userId
    }
    const result: CreateAskResponse = await askService.create(data);
    res.json(result);
});

askRouter.delete('/:id', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const id = req.params.id;
    const result: DeleteAskResponse | null = await askService.tryDelete(id, userId);
    if (!result) {
        res.status(400).end();
        return;
    }
    res.json(result);
});

askRouter.put('/:id', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const id = req.params.id;
    const body = stripId(req.body) as UpdateAskBody;
    const data: Prisma.AskUpdateInput = {...body};
    const result: UpdateAskResponse | null = await askService.tryUpdate(id, userId, data);
    if (!result) {
        res.status(400).end();
        return;
    }
    res.json(result);
});