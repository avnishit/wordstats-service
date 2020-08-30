import express from 'express';
import { Request as request , Response as response } from 'express';
import { getWordStats } from '../../app/getWordStats';
import { appResult } from '../../core/appResult';

class wordCounterRoute {
    public path = '/statistics';
    public router = express.Router();

    constructor() {
        this.router.get(this.path, this.index);
    }

    index = async (req: request, res: response) => {
        if (!(req.query?.input && typeof req.query?.input === 'string')) {
            res.status(appResult.badInput).json();
        }
        const [result, count] = await getWordStats.execute(req.query.input as string);
        if (result === appResult.success ) res.json({ count });
        else res.status(result).json();
    }
}

export default wordCounterRoute;
