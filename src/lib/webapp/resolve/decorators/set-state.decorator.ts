import { artboardLayer } from "@/web/init";

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
        setTimeout(() => {
            const state = artboardLayer.svg.outerHTML;
            localStorage.setItem('state', state);
            console.log('State set');
        }, 0);
        return res;
    };
}
