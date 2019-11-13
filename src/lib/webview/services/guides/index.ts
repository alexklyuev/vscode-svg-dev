import { canvasGuides } from "@/web/init";

// import { Guides } from "./guides";


// export const guides = new Guides();

// export function updateGuides(): Function {
//     return function(_instancePrototype: any, _propertyKey: string, descriptor: PropertyDescriptor) {
//         const orig = descriptor.value;
//         descriptor.value = function (...args: any[]) {
//             const returnValue = orig.call(this, ...args);
//             setTimeout(() => {
//                 guides.setContainerStyles();
//             }, 0);
//             return returnValue;
//         };
//     };
// }

export const guides = canvasGuides;
