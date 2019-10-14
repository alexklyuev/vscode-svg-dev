export function fromDomEvent <T extends Event>(this: void, target: EventTarget, eventName: string): AsyncIterableIterator<T> {
    let fn = Function();
    const listener = (event: Event) => fn({value: event, done: false});
    target.addEventListener(eventName, listener);
    const unsubscribe = () => target.removeEventListener(eventName, listener);
    const iter = {
        [Symbol.asyncIterator] () {
            return this;
        },
        next () {
            return new Promise<{value: Event, done: boolean}>(resolve => {
                fn = resolve;
            });
        },
        return () {
            unsubscribe();
            // console.log(`unsubscribed from ${ eventName }`);
            return Promise.resolve<{value: Event, done: boolean}>({value: null as any, done: true});
        },
    };
    return iter as AsyncIterableIterator<T>;
}
