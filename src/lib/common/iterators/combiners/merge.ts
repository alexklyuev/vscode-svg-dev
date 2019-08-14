export function merge (this: void, ...iteratorFns: Array<() => AsyncIterableIterator<any>>) {
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
  iteratorFns.forEach(iteratorFn => {
      const iterator = iteratorFn();
      iterator.next().then(function onResolve (this: void, { value, done }: IteratorResult<any>) {
          fn({value, done});
          if (!done) {
              iterator.next().then(onResolve);
          }
      });
  });
  return async function * (this: void) {
      yield * obj;
  };
}
