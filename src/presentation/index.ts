import * as bodyParser from 'body-parser';
import { wordCounterRoute, wordStatsRoute } from './routes';
import restServer from './server';
import configuration from '../configuration';

class presentationLayer {
    public static async start() : Promise<restServer> {
        const app = new restServer({
            port: configuration.httpPort,
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
        return app;
    }
}

export default presentationLayer;
