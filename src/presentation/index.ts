import * as bodyParser from 'body-parser';
import { wordCounterRoute, wordStatsRoute } from './routes';
import restServer from './server';

class presentationLayer {
    public static async start() {
        const app = new restServer({
            port: 5000,
            routes: [
                new wordCounterRoute(),
                new wordStatsRoute()
            ],
            middlewares: [
                bodyParser.json(),
                bodyParser.urlencoded({ extended: true }),
            ]
        })
        app.start();
    }
}

export default presentationLayer;
