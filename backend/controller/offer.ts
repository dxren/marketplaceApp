import { Router } from 'express';
import { OfferService } from '../service/offer';
import { getUserIdOrError, parseGetManyOptions } from './utils';
import { CreateOfferBody, CreateOfferResponse, DeleteOfferResponse, GetManyOfferResponse, GetOneOfferResponse, UpdateOfferBody, UpdateOfferResponse } from '../../shared/apiTypes';
import { CreateOfferParams, UpdateOfferParams } from '../types';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { createUserFromAuth } from '../middleware/user';

export const offerRouter = Router();

offerRouter.use(ClerkExpressWithAuth(), createUserFromAuth());

// GET_MANY
offerRouter.get('/', async (req, res) => {
    const options = parseGetManyOptions(req);
    const result: GetManyOfferResponse = await OfferService().getMany(options);
    res.json(result);
});

// GET_ONE
offerRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    const result: GetOneOfferResponse | null = await OfferService().getOne(id);
    if (!result) {
        res.status(404).end();
        return;
    }
    res.json(result);
});

// GET_MANY_BY_CURRENT_USER
offerRouter.get('/user', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const options = parseGetManyOptions(req);
    const result: GetManyOfferResponse | null = await OfferService().getManyByUser(userId, options);
    if (!result) {
        res.status(404).end();
        return;
    }
    res.json(result);
});

// GET_MANY_BY_USER
offerRouter.get('/user/:id', async (req, res) => {
    const id = req.params.id;
    const options = parseGetManyOptions(req);
    const result: GetManyOfferResponse | null = await OfferService().getManyByUser(id, options);
    if (!result) {
        res.status(404).end();
        return;
    }
    res.json(result);
});

// CREATE
offerRouter.post('/', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const body = req.body as Partial<CreateOfferBody>;
    const {title, description} = body;
    if (!title) {
        res.status(400).end();
        return;
    }
    const data: CreateOfferParams = {
        title,
        description,
        userId
    }
    const result: CreateOfferResponse = await OfferService().create(data);
    res.json(result);
});

// DELETE
offerRouter.delete('/:id', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const id = req.params.id;

    const toDelete = await OfferService().getOne(id);
    const hasPermission = toDelete?.user.id === userId;
    if (!hasPermission) {
        res.status(401).end();
        return;
    }

    const result: DeleteOfferResponse | null = await OfferService().delete(id);
    if (!result) {
        res.status(400).end();
        return;
    }
    res.json(result);
});

// UPDATE
offerRouter.put('/:id', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const id = req.params.id;

    const toUpdate = await OfferService().getOne(id);
    const hasPermission = toUpdate?.user.id === userId;
    if (!hasPermission) {
        res.status(401).end();
        return;
    }

    const body = req.body as UpdateOfferBody;
    const data: UpdateOfferParams = {
        title: body.title,
        description: body.description
    };
    const result: UpdateOfferResponse | null = await OfferService().update(id, data);
    res.json(result);
})