export async function * merge (this: void, ...iterators: AsyncIterableIterator<any>[]) {
    for (let iterator of iterators) {
        yield * iterator;
    }
}

export function takeUntil (this: void, iterator: AsyncIterableIterator<any>, interceptor: AsyncIterableIterator<any>) {
    let interceptDone = false;
    let fn = Function();
    const obj = {
        [Symbol.asyncIterator] () {
            return {
                next: () => {
                    return new Promise<{value: any, done: boolean}>(resolve => {
                        fn = resolve;
                    });
                },
            };
        },
    };
    iterator.next().then(function recur (this: void, {value, done}) {
        fn({ value, done: done || interceptDone });
        if (!done) {
            iterator.next().then(recur);
        }
    });
    interceptor.next().then((_res) => {
        interceptDone = true;
    });
    return async function * (this: void) {
        yield * obj;
    }();
}
