/**
 * emit mehtod key - should not be exported
 */
const emit = Symbol();

export class EventBus<Data> {

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
                if (eventEmitter instanceof EventBus) {
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

/**
 * @deprecated
 */
export function withEvent<T, Of>(fn: (instance: T) => EventBus<Of>) {
    return function(_instancePrototype: any, _propertyName: string, descriptor: PropertyDescriptor) {
        const orig = descriptor.value;
        if (orig instanceof Function) {
            descriptor.value = function(...args: any[]) {
                const returnValue = orig.call(this, ...args);
                const eventEmitter = fn(this as T);
                if (eventEmitter instanceof EventBus) {
                    eventEmitter[emit](returnValue);
                } else {
                    throw new Error('withEvent: not an event');
                }
                return returnValue;
            };
        } else {
            throw new Error('connectEvent: not a method');
        }
    };
}

export async function * iterateEvent<Payload> (event: EventBus<Payload>): AsyncIterableIterator<Payload> {
    yield * {
        [Symbol.asyncIterator]: () => {
            return {
                next: () => {
                    return new Promise<IteratorResult<Payload>>(resolve => {
                        event.once(value => {
                            resolve({ value, done: false });
                        });
                    });
                },
            };
        },
    };
}

export async function * combineEvents<P1, P2> (eventBus1: EventBus<P1>, eventBus2: EventBus<P2>): AsyncIterableIterator<P1 | P2> {
    yield * iterateEvent(eventBus1);
    yield * iterateEvent(eventBus2);
}

export async function * mergeEvents (...eventBuses: EventBus<any>[]): AsyncIterableIterator<any> {
    for (let bus of eventBuses) {
        yield * iterateEvent(bus);
    }
}
