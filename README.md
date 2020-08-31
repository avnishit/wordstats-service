## WordStats Service

> Reads a textinput / local file on server / remote file & stores the word count.
> Note: Service only returns HTTP Status codes (200 - success, 400 - bad Input, 500- Server Error) for Fail API responses with empty body. Body has data only in success scenarios.

### Scripts

#### `docker-compose up --build`
Starts the application in development using `nodemon` and `ts-node` to do hot reloading.

#### `docker-compose exec wordstats-service  bash -c "npm run test:integration`
Runs basic integration tests on localhost

### Endpoints

[Sample `Postman Collection`](https://www.postman.com/collections/4b4bb4262d79d1507a82)

#### `POST /counter/<text/serverpath/remoteurl> { input: string }`
Validates & queues the input for future processing.

#### `GET /statistics?input=<word>`
Returns count for number of occurances of word

### Assumptions / Limitations
- With default config, a single task (text, file, url) processing is not atomic. Refer to config file for more details.
- Tokenization is done using default behaviour of https://vocajs.com/#words
- Tasks & TaskQueue are currently not persistant, only the word stats result are. Tasks are simply queued up & processed, there is no retry mechanism in place right now.
- File content (text or binary) validation existis only for url & text input. All server files are being treated & processing is attempted as text. For eg. a large video file (loacl server path) will be processed as text after attempted string conversions.
- Files are being streamed, words that get split across stream chunks are not handled.
- For server file path, use default folder path from config to store files ( its set to 'assets'), right now there is no access security in place.

### Logical Application Layers

#### [Presentation `src/presentation`](./src/presentation)
The presentation layer contains the entry points of the application, such as HTTP servers.

#### [Application `src/app`](./src/app)
The application layer contains the business rules that make up the overall function of the service. Applications mediate between the
presentation and infrastructure components, and provide an isolated layer in which business logic can exist,
de-coupled from any presentation or infrastructure concrete implementation.

#### [Core `src/core`](./src/core)
The core layer contains the generic models, interfaces & utils for the app, presentation and infrastructure components.

#### [Infrastructure `src/infra`](./src/infra)
Infrastructure components interface with external services and frameworks such as databases, filesystems and other third party services.
