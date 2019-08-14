type StoreIter = () => {[ Symbol.asyncIterator ]: () => any};
export type DescriptorIterationMap = Map<Function, StoreIter>;

const link = Symbol();

export const MakeIterator = (map: DescriptorIterationMap) => {
    return <T>() => {
        return function (_instancePrototype: any, _methodName: string, descriptor: PropertyDescriptor) {
            const { value } = descriptor;
            if (!(value instanceof Function)) {
                throw new Error(`makeIterator decorator applied to not a function`);
            }
            // let fn = new Function();
            let fns = Array<Function>();
            const iterFn = () => {
                return {
                    [Symbol.asyncIterator] () {
                        return {
                            next: () => {
                                return new Promise<T>(resolve => {
                                    fns.push(resolve);
                                });
                            },
                        };
                    },
                };
            };
            // const iter = {
            //     [Symbol.asyncIterator] () {
            //         return {
            //             next: () => {
            //                 return new Promise<T>(resolve => {
            //                     fn = resolve;
            //                 });
            //             },
            //         };
            //     },
            // };
            map.set(value, iterFn);
            const newValue = function (this: any, ...args: any[]) {
                const result = value.call(this, ...args);
                setTimeout(() => {
                    fns.forEach(fn => {
                        fn({ value: result, done: false });
                    });
                }, 0);
                return result;
            };
            (newValue as any)[link] = value;
            descriptor.value = newValue;
        };
    };
};

export const FindIterator = (map: DescriptorIterationMap) => {
    return <K>(method: any) => {
        const iter = map.get(method[link])!;
        return async function * <T = K>(this: void): AsyncIterableIterator<T> {
            yield * iter();
        };
    };
};


