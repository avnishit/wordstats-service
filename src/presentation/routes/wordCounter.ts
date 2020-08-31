import express from 'express';
import { Request as request , Response as response } from 'express';
import { addTask } from '../../app/addTask';
import { appResult } from '../../core/appResult';
import logger from '../../infra/logger';

class wordCounterRoute {
    public path = '/counter/:type';
    private static allowedTypes: Map<string, number> = new Map([
        ['text', 0],
        ['serverpath', 1],
        ['remoteurl', 2]
    ])
    public router = express.Router();

    constructor() {
        this.router.post(this.path, this.index);
    }

    index = async (req: request, res: response) => {
        const type = req.params.type;
        const { input } = req.body;
        if (!wordCounterRoute.allowedTypes.has(type) || !(typeof input === 'string')) {
            res.status(appResult.badInput).json();
        }
        const result = await addTask.execute(input, wordCounterRoute.allowedTypes.get(type) as number);
        logger.info({result}, 'Add Task');
        res.status(result).json();
    }
}

export default wordCounterRoute;
