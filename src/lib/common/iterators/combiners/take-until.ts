export function takeUntil (this: void, iteratorFn: () => AsyncIterableIterator<any>, interceptorFn: () => AsyncIterableIterator<any>) {
  const iterator = iteratorFn();
  const interceptor = interceptorFn();
  let interceptDone = false;
  let nextFn = Function();
//   let returnFn = Function();
  const obj = {
      [Symbol.asyncIterator] () {
          return {
              next: () => {
                return new Promise<{value: any, done: boolean}>(resolve => {
                    nextFn = resolve;
                });
              },
            //   return: () => {
            //     return new Promise<{value: any, done: boolean}>(resolve => {
            //         returnFn = resolve;
            //     });
            //   },
          };
      },
  };
  iterator.next().then(function onResolve (this: void, {value, done}) {
      done = done || interceptDone;
      nextFn({ value, done });
      if (!done) {
          iterator.next().then(onResolve);
      } else {
        //   iterator[Symbol.asyncIterator]().return!();
      }
  });
  interceptor.next().then((_res) => {
      interceptDone = true;
      iterator[Symbol.asyncIterator]().return!();
  });
  return async function * (this: void) {
    //   yield * obj;
    for await ( const value of obj ) {
        yield value;
    }
  };
}
