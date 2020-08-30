# wordStats Service

> Reads a textinput / local file on server / remote file & stores the word count.

### Scripts

#### `docker-compose up --build`
Starts the application in development using `nodemon` and `ts-node` to do hot reloading.

### Endpoints

#### `POST /counter/<text/serverpath/remoteurl> { input: string }`
Validates & queues the input for future processing.

#### `GET /statistics?input=<word>`
Returns count for number of occurances of word

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

### Assumptions / Limitations
- With default config, a single task (text, file, url) processing is not atomic. Refer to config file for more details.
- Tasks & TaskQueue are currently not persistant, only the word stats result are. Tasks are simply queued up & processed, there is no retry mechanism in place right now.
- All files are being treated & processing is attempted as text.