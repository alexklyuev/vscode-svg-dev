export class ClientEvent<Data> {

    private callbacks = new Set<(data: Data) => void>();

    on(callback: (data: Data) => void): void {
        this.callbacks.add(callback);
    }

    off(callback: (data: Data) => void): void {
        this.callbacks.delete(callback);
    }

    emit(data: Data) {
        this.callbacks.forEach(callback => callback(data));
    }

}

export function fromEvent<EventData>(event: ClientEvent<EventData>) {
    return function (_instancePrototype: {}, propertyName: string, descriptor: PropertyDescriptor) {
        const origFn = descriptor.value;
        if (origFn instanceof Function) {
            
        } else {
            throw new Error('fromEvent: decorated entity is not a method');
        }
    };
}
