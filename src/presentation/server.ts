import express from 'express';
import { Application as application } from 'express';

class restServer {
    public app: application
    public port: number

    constructor(appInit: { port: number; middlewares: any; routes: any; }) {
        this.app = express()
        this.port = appInit.port

        this.middlewares(appInit.middlewares)
        this.routes(appInit.routes)
    }

    private middlewares(middlewares: { forEach: (arg0: (middleWare: any) => void) => void; }) {
        middlewares.forEach(middleWare => {
            this.app.use(middleWare)
        })
    }

    private routes(routes: { forEach: (arg0: (controller: any) => void) => void; }) {
        routes.forEach(controller => {
            this.app.use('/', controller.router)
        })
    }

    public start() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the http://localhost:${this.port}`)
        })
    }
}

export default restServer;
