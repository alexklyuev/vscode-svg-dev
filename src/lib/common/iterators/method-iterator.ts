export const createIterativeMethods = () => {

    const map = new Map<Function, [Function, Object | undefined][]>();

    const makeMethodIterator = <T>() => {
        return function (_instancePrototype: any, _methodName: string, descriptor: PropertyDescriptor) {
            const { value } = descriptor;
            const newValue = function(this: any, ...args: any[]) {
                const result: T = value.call(this, ...args);
                setTimeout(() => {
                    const fns = map.get(newValue)!;
                    fns.forEach(([fn, instance]) => {
                        if (!instance || instance === this) {
                            fn(result);
                        }
                    });
                    fns.length = 0;
                }, 0);
                return result;
            };
            descriptor.value = newValue;
            map.set(newValue, Array<[Function, Object | undefined]>());
        };
    };

    /**
     * method is some class method which has been decorated with `@makeMethodIterator()`
     * R is return value type of method
     */
    const findMethodIterator = <R>(method: (...args: any[]) => R, instance: Object | undefined = undefined) => {
        const callbacks = map.get(method)!;
        let localResolve: Function;
        let done = false;
        const iter = {
            [Symbol.asyncIterator] () {
                return this;
            },
            next () {
                const prom = new Promise(resolve => {
                    localResolve = (value: R) => resolve({value, done});
                    callbacks.push([localResolve, instance]);
                });
                return prom;
            },
            return () {
                done = true;
                if (localResolve instanceof Function) {
                    localResolve(null);
                }
            },
        };
        return iter as AsyncIterableIterator<R>;
    };

    return { makeMethodIterator, findMethodIterator };
};
