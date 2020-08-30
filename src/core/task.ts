export class task {
    public static create({
        input,
        type = task.inputType.text
    }: {
        input: string,
        type?: task.inputType,
    }): task {
        return new task(
            input,
            type,
            task.state.queqed,
            0,
            ''
        );
    }

    constructor(
        public readonly input: string,
        public readonly type: task.inputType,
        public readonly state: task.state,
        public readonly retires: number,
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
