import { Router } from 'express';
import { OfferService } from '../service/offer/service';
import { getUserIdOrError, stripId } from './utils';
import { CreateOfferBody, CreateOfferResponse, DeleteOfferResponse, GetManyOfferResponse, GetOneOfferResponse, UpdateOfferBody, UpdateOfferResponse } from '../../shared/apiTypes';
import { Prisma } from '@prisma/client';
import { Unchecked } from '../types';

export const offerRouter = Router();

const offerService = OfferService();

offerRouter.get('/', async (req, res) => {
    const {error} = getUserIdOrError(req, res);
    if (error) return;
    const result: GetManyOfferResponse = await offerService.getAll();
    res.json(result);
});

offerRouter.get('/:id', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    userId;
    const id = req.params.id;
    const result: GetOneOfferResponse | null = await offerService.getOne(id);
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

offerRouter.post('/', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const body = req.body as Unchecked<CreateOfferBody>;
    const description = body.description;
    if (!description) {
        res.status(400).end();
        return;
    }
    const data: Prisma.OfferUncheckedCreateInput = {
        description,
        userId
    }
    const result: CreateOfferResponse = await offerService.create(data);
    res.json(result);
});

offerRouter.delete('/:id', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const id = req.params.id;
    const result: DeleteOfferResponse | null = await offerService.tryDelete(id, userId);
    if (!result) {
        res.status(400).end();
        return;
    }
    res.json(result);
});

offerRouter.put('/:id', async (req, res) => {
    const {userId, error} = getUserIdOrError(req, res);
    if (error) return;
    const id = req.params.id;
    const body = stripId(req.body) as UpdateOfferBody;
    const data: Prisma.OfferUpdateInput = {...body};
    const result: UpdateOfferResponse | null = await offerService.tryUpdate(id, userId, data);
    if (!result) {
        res.status(400).end();
        return;
    }
    res.json(result);
});