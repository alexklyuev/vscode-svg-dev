export function takeUntil (this: void, iteratorFn: () => AsyncIterableIterator<any>, interceptorFn: () => AsyncIterableIterator<any>) {
  const iterator = iteratorFn();
  const interceptor = interceptorFn();
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
  iterator.next().then(function onResolve (this: void, {value, done}) {
      done = done || interceptDone;
      fn({ value, done });
      if (!done) {
          iterator.next().then(onResolve);
      }
  });
  interceptor.next().then((_res) => {
      interceptDone = true;
  });
  return async function * (this: void) {
      yield * obj;
  };
}
