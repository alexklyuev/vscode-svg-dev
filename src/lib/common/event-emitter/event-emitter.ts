export class EventEmitter<Data> {

    private callbacks = new Set<(data: Data) => void>();

    on(callback: (data: Data) => void): void {
        this.callbacks.add(callback);
    }

    off(callback: (data: Data) => void): void {
        this.callbacks.delete(callback);
    }

    once(callback: (data: Data) => void): void {
        const innerCallback = (data: Data) => {
            callback(data);
            this.off(innerCallback);
        };
        this.on(innerCallback);
    }

    emit(data: Data) {
        this.callbacks.forEach(callback => callback(data));
    }

    get size(): number {
        return this.callbacks.size;
    }

}
