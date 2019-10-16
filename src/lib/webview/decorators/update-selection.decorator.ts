// import { selection } from "../services/selection";


// export function updateSelection(_instancePrototype: any, _propertyKey: string, descriptor: PropertyDescriptor) {
//     const orig: Function = descriptor.value;
//     descriptor.value = function(...args: any[]) {
//         const res = orig.call(this, ...args);
//         setTimeout(() => {
//             selection.update();
//         }, 0);
//         return res;
//     };
// }
