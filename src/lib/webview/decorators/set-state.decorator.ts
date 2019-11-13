import { vscodeHost } from "@/webview/services/host-api/index";
import { artboard } from "@/web/init";
import { historyProducer } from "@/webview/producers/history.producer";

let timeout: number | null = null;
let prev: string;

/**
 * 
 */
export function persistState() {
    const state = artboard.svg.outerHTML;
    vscodeHost.api.setState(state);

    if (state === prev) {
        return;
    } else {
        prev = state;
    }

    if (timeout) {
        window.clearTimeout(timeout);
    }

    timeout = window.setTimeout(() => {
        historyProducer.makeSetRequest({ state });
        timeout = null;
    }, 150);
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
        // console.log(_propertyKey);
        return res;
    };
}
