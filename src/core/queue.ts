export default class queue<T> {
    _store: T[] = [];
    push(val: T): void {
        this._store.push(val);
    }

    pop(): T | undefined {
        return this._store.shift();
    }

    peek(): T | undefined {
        if (this._store.length) {
            return this._store[0];
        }
    }
}