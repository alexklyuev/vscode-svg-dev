// type StoreIter = () => {[ Symbol.asyncIterator ]: () => any};
// export type DescriptorIterationMap = Map<Function, StoreIter>;

// const link = Symbol();

// export const MakeIterator = (map: DescriptorIterationMap) => {
//     return <T>() => {
//         return function (_instancePrototype: any, _methodName: string, descriptor: PropertyDescriptor) {
//             const { value } = descriptor;
//             if ( !(value instanceof Function) ) {
//                 throw new Error(`makeIterator decorator applied to not a function`);
//             }
//             let fns = Array<Function>();
//             const iterFn = () => {
//                 return {
//                     [Symbol.asyncIterator] () {
//                         return this;
//                     },
//                     next: () => {
//                         return new Promise<T>(resolve => {
//                             fns.push(resolve);
//                         });
//                     },
//                     return: () => {
//                         console.log('returned');
//                         fns.forEach(fn => fn({value: null, done: true}));
//                     },
//                 };
//             };
//             map.set(value, iterFn);
//             const newValue = function (this: any, ...args: any[]) {
//                 const result = value.call(this, ...args);
//                 setTimeout(() => {
//                     fns.forEach(fn => {
//                         fn({ value: result, done: false });
//                     });
//                     fns.length = 0;
//                 }, 0);
//                 return result;
//             };
//             (newValue as any)[link] = value;
//             descriptor.value = newValue;
//         };
//     };
// };

// export const FindIterator = (map: DescriptorIterationMap) => {
//     return <K>(method: any) => {
//         const iter = map.get(method[link])!;
//         return async function * <T = K>(this: void): AsyncIterableIterator<T> {
//             for await ( const value of iter() ) {
//                 console.log(value);
//                 yield value;
//             }
//         };
//         // return iter;
//     };
// };



export const createIterativeMethods = () => {
    const map = new Map<Function, Function[]>();

    const makeIterator = <T>() => {
        return function (_instancePrototype: any, _methodName: string, descriptor: PropertyDescriptor) {
            const { value } = descriptor;
            const newValue = function(this: any, ...args: any[]) {
                const result: T = value.call(this, ...args);
                setTimeout(() => {
                    const fns = map.get(newValue)!;
                    fns.forEach(fn => fn(result));
                    fns.length = 0;
                }, 0);
                return result;
            };
            descriptor.value = newValue;
            map.set(newValue, []);
        };
    };

    const findIterator = <T>(method: Function) => {
        const callbacks = map.get(method)!;
        let localResolve: Function;
        let done = false;
        const iter = {
            [Symbol.asyncIterator] () {
                return this;
            },
            next () {
                const prom = new Promise(resolve => {
                    localResolve = (value: T) => resolve({value, done});
                    callbacks.push(localResolve);
                });
                return prom;
            },
            return () {
                done = true;
                localResolve(null);
            },
        };
        return iter as AsyncIterableIterator<T>;
    };

    return { makeIterator, findIterator };
};


