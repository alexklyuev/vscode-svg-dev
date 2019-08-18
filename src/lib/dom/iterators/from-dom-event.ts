export function fromDomEvent (this: void, target: EventTarget, eventName: string) {
    let fn = Function();
    const iter = {
        [Symbol.asyncIterator] () {
            return {
                next () {
                    return new Promise<{value: Event, done: boolean}>(resolve => {
                        fn = resolve;
                    });
                },
                return () {
                    target.removeEventListener(eventName, listener);
                    return Promise.resolve<{value: Event, done: boolean}>({value: null as any, done: true});
                },
            };
        },
    };
    const listener = (event: Event) => fn({value: event, done: false});
    target.addEventListener(eventName, listener);
    return async function * (
        this: void,
        triggerReturn: () => boolean = () => false,
    ) {
        for await ( const value of iter ) {
            if ( triggerReturn() ) {
                return;
            } else {
                yield value;
            }
        }
    };
}