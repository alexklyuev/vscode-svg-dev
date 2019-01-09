import { DataClass } from "./data-class.interface";

export function createDataClass<T>(this: void) {
    return class implements DataClass<T> {
        constructor(public readonly value: T) {}
    };
}
