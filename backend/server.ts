import express from 'express';
import cors from 'cors';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { User as UserMiddleware } from './middleware/user';

const PORT = 8080;

const app = express();

app.use(express());
app.use(cors());
app.use(ClerkExpressWithAuth());
app.use(UserMiddleware());

app.get('/', (req, res) => res.end('Index'));

app.listen(PORT, () => console.log(`Console listening on port ${PORT}.`));