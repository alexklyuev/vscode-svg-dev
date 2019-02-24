import { TypedWire } from "../services/typed-wire/typed-wire";
import { createDataClass } from "../services/typed-wire/create-data-class.function";

export const zoomWire = new TypedWire(
    'zoom',
    createDataClass<number>(),
    createDataClass<number>(),
);
