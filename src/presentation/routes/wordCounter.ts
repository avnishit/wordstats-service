import express from 'express';
import { Request as request , Response as response } from 'express';
import { addTask } from '../../app/addTask';
import logger from '../../infra/logger';

class wordCounterRoute {
    public path = '/counter';
    public router = express.Router();

    constructor() {
        this.router.get(this.path, this.index);
    }

    index = async (req: request, res: response) => {
        const {
            input,
            type
        } = req.body;
        const result = await addTask.execute(input, Number(type));
        logger.info({result}, 'Add Task');
        res.status(result).json();
    }
}

export default wordCounterRoute;
