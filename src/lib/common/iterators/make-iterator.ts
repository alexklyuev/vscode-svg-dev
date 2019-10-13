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
            map.set(newValue, Array<Function>());
        };
    };

    /**
     * method is some class method which has been decorated with `@makeIterator()`
     * R is return value type of method
     */
    const findIterator = <R>(method: (...args: any[]) => R) => {
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
                    callbacks.push(localResolve);
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

    return { makeIterator, findIterator };
};
