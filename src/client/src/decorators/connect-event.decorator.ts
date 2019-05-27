import { ClientEvent } from "../entities/client-event";


export function connectEvent(eventName: string) {
    return function (_instancePrototype: any, _propertyName: string, descriptor: PropertyDescriptor) {
        const orig = descriptor.value;
        if (orig instanceof Function) {
            descriptor.value = function(...args: any[]) {
                const returnValue = orig.call(this, ...args);
                const eventEmitter = (this as any)[eventName];
                if (eventEmitter instanceof ClientEvent) {
                    eventEmitter.emit(returnValue);
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
