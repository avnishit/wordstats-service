import express from 'express';
import { Request as request , Response as response } from 'express';
import { getWordStats } from '../../app/getWordStats';

import logger from '../../infra/logger';

class wordCounterRoute {
    public path = '/stats'
    public router = express.Router()

    constructor() {
        this.initRoutes()
    }

    public initRoutes() {
        this.router.get('/stats', this.index)
    }

    index = async (req: request, res: response) => {
        const count: number | null = await getWordStats.execute(req.query.input as string);
        res.json({ count });
    }
}

export default wordCounterRoute;
