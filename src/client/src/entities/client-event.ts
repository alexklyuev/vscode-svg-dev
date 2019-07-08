/**
 * emit mehtod key - should not be exported
 */
const emit = Symbol();

export class ClientEvent<Data> {

    private callbacks = new Set<(data: Data) => void>();

    on(callback: (data: Data) => void): void {
        this.callbacks.add(callback);
    }

    off(callback: (data: Data) => void): void {
        this.callbacks.delete(callback);
    }

    [emit](data: Data) {
        this.callbacks.forEach(callback => callback(data));
    }

    get size(): number {
        return this.callbacks.size;
    }

}

export function connectEvent(eventName: string) {
    return function (_instancePrototype: any, _propertyName: string, descriptor: PropertyDescriptor) {
        const orig = descriptor.value;
        if (orig instanceof Function) {
            descriptor.value = function(...args: any[]) {
                const returnValue = orig.call(this, ...args);
                const eventEmitter = (this as any)[eventName];
                if (eventEmitter instanceof ClientEvent) {
                    eventEmitter[emit](returnValue);
                } else {
                    throw new Error('connectEvent: not an event');
                }
                return returnValue;
            };
        } else {
            throw new Error('connectEvent: not a method');
        }
    };
}
