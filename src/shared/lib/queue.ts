export class Queue<T> {
    private readonly _items: T[];
    private readonly _maxSize: number;

    constructor(maxSize: number) {
        this._items = [];
        this._maxSize = maxSize;
    }

    public Add(item: T): void {
        if (this._items.length >= this._maxSize) {
            this._items.shift();
        }

        this._items.push(item);
    }

    public ToArray(): T[] {
        return [...this._items];
    }
}
