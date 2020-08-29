import express from 'express';
import { Request as request , Response as response } from 'express';
import { getWordStats } from '../../app/getWordStats';

class wordCounterRoute {
    public path = '/stats'
    public router = express.Router()

    constructor() {
        this.initRoutes()
    }

    public initRoutes() {
        this.router.get('/stats', this.index)
    }

    index = (req: request, res: response) => {

        const count = getWordStats.execute(req.params.word);
        res.json({ count });
    }
}

export default wordCounterRoute;
