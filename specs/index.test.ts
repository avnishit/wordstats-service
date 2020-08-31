import chai from 'chai';
import 'mocha';
import request from 'supertest';
import utils from '../src/core/utils';

const { expect } = chai;
let serverAddr = 'http://localhost:5000';

describe('Wordstat Service Tests', () => {

    it('Returns consistent stats across various tasks - text input', async () => {

        let oldCount = 0;

        request(serverAddr).get('/statistics?input=somehighlyunlikelyword')
        .end(function(err, res) { 
            expect((res as any).statusCode).to.equal(200); 
            if (res?.body?.count) oldCount = res.body.count;
        });

        const payload = {
            input: 'somehighlyunlikelyword somehighlyunlikelyword'
        }

        request(serverAddr).post('/counter/text').send(payload)
        .end(function(err, res) { 
            expect((res as any).statusCode).to.equal(200);
        });

        await utils.delay(10000);

        request(serverAddr).get('/statistics?input=somehighlyunlikelyword')
        .end(function(err, res) { 
            expect((res as any).statusCode).to.equal(200); 
            expect((res as any).body.count).to.equal(oldCount + 2);
        });
    });

    it('Returns consistent stats across various tasks - server file input', async () => {

        let oldCount = 0;

        request(serverAddr).get('/statistics?input=capital')
        .end(function(err, res) { 
            expect((res as any).statusCode).to.equal(200); 
            if (res?.body?.count) oldCount = res.body.count;
        });

        const payload = {
            input: 'sample-1.txt'
        }

        request(serverAddr).post('/counter/serverpath').send(payload)
        .end(function(err, res) { 
            expect((res as any).statusCode).to.equal(200);
        });

        await utils.delay(10000);

        request(serverAddr).get('/statistics?input=capital')
        .end(function(err, res) { 
            expect((res as any).statusCode).to.equal(200); 
            expect((res as any).body.count).to.equal(oldCount + 56);
        });
    });

    it('Returns consistent stats across various tasks - remote url', async () => {

        let oldCount = 0;

        request(serverAddr).get('/statistics?input=browser')
        .end(function(err, res) { 
            expect((res as any).statusCode).to.equal(200); 
            if (res?.body?.count) oldCount = res.body.count;
        });

        const payload = {
            input: 'http://www.yutz-equitation.com'
        }

        request(serverAddr).post('/counter/remoteurl').send(payload)
        .end(function(err, res) { 
            expect((res as any).statusCode).to.equal(200);
        });

        await utils.delay(20000);

        request(serverAddr).get('/statistics?input=browser')
        .end(function(err, res) { 
            expect((res as any).statusCode).to.equal(200); 
            expect((res as any).body.count).to.equal(oldCount + 3);
        });
    });

    it('Returns BadInput for NonExistant File & Url', async () => {

        const payload = {
            input: 'sample-2.txt'
        }

        request(serverAddr).post('/counter/serverpath').send(payload)
        .end(function(err, res) { 
            expect((res as any).statusCode).to.equal(400);
        });

        const payloadurl = {
            input: 'https://sample-2.txt'
        }


        request(serverAddr).post('/counter/remoteurl').send(payloadurl)
        .end(function(err, res) { 
            expect((res as any).statusCode).to.equal(400);
        });
    });

    it('Returns BadInput for Not Text Remote URL', async () => {

        const payloadurl = {
            input: 'https://imageskincare.nl/media/wysiwyg/Janna-Ronert-CEO-IMAGE-Skincare.1822019.jpg'
        }

        request(serverAddr).post('/counter/remoteurl').send(payloadurl)
        .end(function(err, res) { 
            expect((res as any).statusCode).to.equal(400);
        });
    });

});
