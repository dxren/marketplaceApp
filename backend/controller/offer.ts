import { Router } from 'express';
import { OfferService } from '../service/offer';
import { getUserIdOrError, parseGetManyOptions } from './utils';
import { CreateOfferBody, UpdateOfferBody } from '../../shared/apiTypes';
import { CreateOfferParams, UpdateOfferParams } from '../types';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { createUserFromAuth } from '../middleware/user';
import { Offer } from '../../shared/types';

export const offerRouter = Router();

offerRouter.use(ClerkExpressWithAuth(), createUserFromAuth());

// GET_MANY
offerRouter.get('/', async (req, res) => {
    const options = parseGetManyOptions(req);
    const [offers, count] = await Promise.all([OfferService().getMany(options), OfferService().getCount()]);
    const result = {offers, count};
    res.json(result);
});

// GET_ONE
offerRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    const result: Offer | null = await OfferService().getOne(id);
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
    const [offers, count] = await Promise.all([OfferService().getManyByUser(userId, options), OfferService().getCount()]);
    if (!offers) {
        res.status(404).end();
        return;
    }
    const result = {offers, count};
    res.json(result);
});

// GET_MANY_BY_USER
offerRouter.get('/user/:id', async (req, res) => {
    const id = req.params.id;
    const options = parseGetManyOptions(req);
    const [offers, count] = await Promise.all([OfferService().getManyByUser(id, options), OfferService().getCount()]);
    if (!offers) {
        res.status(404).end();
        return;
    }
    const result = {offers, count};
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
    const result: Offer = await OfferService().create(data);
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

    const result: Offer | null = await OfferService().delete(id);
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
    const result: Offer | null = await OfferService().update(id, data);
    res.json(result);
});

// GET_FAVORITED_BY_USER
offerRouter.get('/favoritedBy/:userId', async (req, res) => {
    const userId = req.params.userId;
    const options = parseGetManyOptions(req);
    const result = await OfferService().getFavoritedByUser(userId, options);
});