export function exposed <T = any>(this: void) {
    let emit = Function();
    const iter = {
        [Symbol.asyncIterator] () {
            return {
                next () {
                    return new Promise<{value: T, done: boolean}>(resolve => {
                        emit = (value: T) => {
                            console.log('emited');
                            resolve({value, done: false});
                        };
                    });
                },
            };
        },
    };
    const iterable = async function * (this: void) {
        yield * iter;
    };
    return { emitter: () => emit, iterable };
}
