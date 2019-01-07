import { DataClass } from "./data-class.interface";

export class DataClassFactory<T> {
    constructor() {
        return class implements DataClass<T> {
            constructor(public readonly value: T) {}
        };
    }
}
