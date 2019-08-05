import { Guides } from "./guides";
import { artboard } from "../artboard";
import { spawn } from "../../../../lib/dom/spawner";


export const guides = new Guides(artboard, spawn);

export function updateGuides(): Function {
    return function(_instancePrototype: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        const orig = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const returnValue = orig.call(this, ...args);
            setTimeout(() => {
                guides.setContainerStyles();
            }, 0);
            return returnValue;
        };
    };
}
