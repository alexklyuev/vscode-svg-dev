import { host } from "../services/host-api";
import { artboard } from "../services/artboard";
import { historyProducer } from "../producers/history.producer";

/**
 * 
 */
export function persistState() {
    const state = artboard.svg.outerHTML;
    host.api.setState(state);
    historyProducer.makeSetRequest({ state });
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
        console.log(_propertyKey);
        return res;
    };
}
