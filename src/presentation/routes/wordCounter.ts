import express from 'express';
import { Request as request , Response as response } from 'express';
import { queueTask } from '../../app/queueTask';

class wordCounterRoute {
    public path = '/count'
    public router = express.Router()

    constructor() {
        this.router.get('/count', this.index)
    }

    index = async (req: request, res: response) => {
        const {
            input,
            type
        } = req.body;
        const { status } = await queueTask.execute(input, type);
        res.json({}).status(200);
    }
}

export default wordCounterRoute;
