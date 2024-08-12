import express from 'express';
import cors from 'cors';

const PORT = 8080;

const app = express();

app.use(express());
app.use(cors());

app.get('/', (req, res) => res.end('Index'));

app.listen(PORT, () => console.log(`Console listening on port ${PORT}.`));