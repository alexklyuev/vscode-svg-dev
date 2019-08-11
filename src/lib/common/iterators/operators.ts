export async function * merge (this: void, ...iterators: AsyncIterableIterator<any>[]) {
    for (let iterator of iterators) {
        yield * iterator;
    }
}

export async function * takeUntil (this: void, iterator: AsyncIterableIterator<any>, interceptor: AsyncIterableIterator<any>) {
    //
}
