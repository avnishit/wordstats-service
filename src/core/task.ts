export class task {
    public static create({
        input,
        type,
        state,
        retires,
        description
    }: {
        input: string,
        type: task.inputType,
        state: task.state,
        retires: number,
        description: string
    }): task {
        return new task(
            input,
        type,
        state,
        retires,
        description
        );
    }

    constructor(
        public readonly input: string,
        public readonly type: task.inputType,
        public readonly state: task.state,
        public readonly  retires: number,
        public readonly description: string
    ) {
    }
}

export namespace task {
    export enum inputType {
        text,
        localFileUrl,
        remoteFileUrl
    }
    
    export enum state {
        queqed,
        runnning,
        errored,
        completed
    }
}
