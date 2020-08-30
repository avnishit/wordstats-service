import express from 'express';
import { Request as request , Response as response } from 'express';
import { addTask } from '../../app/addTask';

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
        const status = await addTask.execute(input, Number(type) || 0 );
        res.json({}).status(200);
    }
}

export default wordCounterRoute;
