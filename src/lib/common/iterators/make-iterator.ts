export type DescriptorIterationMap = Map<Function, {[Symbol.asyncIterator]: () => any}>;

const link = Symbol();

export const MakeIterator = (map: DescriptorIterationMap) => {
    return function <T>(_instancePrototype: any, _methodName: string, descriptor: PropertyDescriptor) {
        const { value } = descriptor;
        if (!(value instanceof Function)) {
            throw new Error(`makeIterator decorator applied to not a function`);
        }
        let fn = new Function();
        const iter = {
            [Symbol.asyncIterator] () {
                return {
                    next: () => {
                        return new Promise<T>(resolve => {
                            fn = resolve;
                        });
                    },
                };
            },
        };
        map.set(value, iter);
        const newValue = function (this: any, ...args: any[]) {
            const result = value.call(this, ...args);
            setTimeout(() => {
                fn({ value: result, done: false });
            }, 0);
            return result;
        };
        (newValue as any)[link] = value;
        descriptor.value = newValue;
    };
};

export const FindIterator = (map: DescriptorIterationMap) => {
    return (method: any) => {
        const iter = map.get(method[link])!;
        return async function * (this: void) {
            yield * iter;
        }();
    };
};


