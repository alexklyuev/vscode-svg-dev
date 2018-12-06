/**
 * @example
 *
 * @Singleton
 * class Alpha {}
 *
 * console.log(new Alpha() === new Alpha()); // true
 */
export function Singleton<T extends {new (...args: any[]): ThisType<T>}>(target: T): T {
    let instance: InstanceType<T>;
    const mod = class extends target {
        constructor(...args: any[]) {
            super(...args);
            if (!instance) {
                instance = this as InstanceType<T>;
            }
            return instance;
        }
    };
    Object.defineProperty(
        mod,
        'name',
        {
            value: target.name,
            writable: false,
            configurable: true,
        },
    );
    return mod;
}
