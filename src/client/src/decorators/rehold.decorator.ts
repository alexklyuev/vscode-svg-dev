import { holder } from "../services/picker";

/**
 * 
 */
export function rehold(_instancePrototype: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const orig: Function = descriptor.value;
    descriptor.value = function(...args: any[]) {
        const res = orig.call(this, ...args);
        setTimeout(() => {
            holder.elements = [...holder.elements];
        }, 0);
        return res;
    };
}

