# wordStats Service

> Reads a textinput / local file on server / remove file & stores the word count.

### Scripts

#### `docker-compose up --build`
Starts the application in development using `nodemon` and `ts-node` to do hot reloading.

### Endpoints

#### `POST /counter { input: string, type: enum (0 - input text, 1 - file on server, 2 - remote file) }`
Queues the input for future processing after validating the input.

#### `GET /statistics?input=<word>`
Returns count for number of occurances of word

### Assumptions / Limitations
