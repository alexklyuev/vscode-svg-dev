import { host } from "../services/host-api";
import { artboard } from "../services/artboard";

/**
 * 
 */
export function persistState() {
    const state = artboard.svg.outerHTML;
    host.api.setState(state);
}

/**
 * class Some {
 *     @setState
 *     method() {}
 * }
 */
export function setState(_instancePrototype: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const orig: Function = descriptor.value;
    descriptor.value = function(...args: any[]) {
        const res = orig.call(this, ...args);
        setTimeout(persistState, 0);
        return res;
    };
}
