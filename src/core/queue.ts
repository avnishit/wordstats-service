export default class queue<T> {
    store: T[] = [];
    push(val: T): void {
        this.store.push(val);
    }

    pop(): T | undefined {
        return this.store.shift();
    }

    peek(): T | undefined {
        if (this.store.length) {
            return this.store[0];
        }
    }
}