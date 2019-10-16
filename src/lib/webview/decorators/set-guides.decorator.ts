// import { guides } from "../services/guides";

// export function updateGuides(): Function {
//     return function(_instancePrototype: any, _propertyKey: string, descriptor: PropertyDescriptor) {
//         const orig = descriptor.value;
//         descriptor.value = function (...args: any[]) {
//             const returnValue = orig.call(this, ...args);
//             setTimeout(() => {
//                 guides.setStyles();
//             }, 0);
//             return returnValue;
//         };
//     };
// }