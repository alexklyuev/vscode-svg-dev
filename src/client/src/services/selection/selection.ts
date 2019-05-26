// import { ElementHolder } from "../picker/element-holder";
// import { Picker } from "../picker/picker";
// import { Artboard } from "../artboard/artboard";
// import { Zoom } from "../zoom/zoom";


// export class _UserSelection {

//     // private box: HTMLDivElement | null = null;

//     private svg: SVGElement | null = null;
//     private rect: SVGRectElement | null = null;

//     private x: number = 0;
//     private y: number = 0;

//     private mousedownListener: (() => void) | null = null;
//     private mouseupListener: (() => void) | null = null;
//     private mousemoveListener: (() => void) | null = null;

//     constructor(
//         private holder: ElementHolder,
//         private picker: Picker,
//         private artboard: Artboard,
//         private zoom: Zoom,
//     ) {}

//     listen() {
//         this.holder.addListener((elements: SVGElement[]) => {
//             const tools = this.artboard.tools;
//             if (this.svg) {
//                 tools.removeChild(this.svg);
//                 this.svg = null;
//                 this.rect = null;
//             }
//             if (elements.length > 0) {
//                 this.svg = self.document.createElementNS('http://www.w3.org/2000/svg', 'svg');
//                 this.rect = self.document.createElementNS('http://www.w3.org/2000/svg', 'rect');
//                 tools.appendChild(this.svg);
//                 this.svg.appendChild(this.rect);
//                 this.update();
//                 this.mousedownListener = this.picker.addMousedownCallback(({ clientX, clientY }) => {
//                     this.x = clientX;
//                     this.y = clientY;
//                 });
//                 this.mousemoveListener = this.picker.addMousemoveCallback(({ clientX, clientY }) => {
//                     const dX = clientX - this.x;
//                     const dY = clientY - this.y;
//                     if (this.rect) {
//                         const top = parseInt(this.rect.getAttribute('y')!);
//                         const left = parseInt(this.rect.getAttribute('x')!);
//                         const newTop = top + dY;
//                         const newLeft = left + dX;
//                         this.rect.setAttribute('y', String(newTop));
//                         this.rect.setAttribute('x', String(newLeft));
//                     }
//                     this.x = clientX;
//                     this.y = clientY;
//                 });
//                 this.mouseupListener = this.picker.addMouseupCallback(_event => {
//                     this.x = 0;
//                     this.y = 0;
//                     if (this.mousedownListener instanceof Function) {
//                         this.mousedownListener();
//                     }
//                     if (this.mousemoveListener instanceof Function) {
//                         this.mousemoveListener();
//                     }
//                     if (this.mouseupListener instanceof Function) {
//                         this.mouseupListener();
//                     }
//                 });
//             }
//         });
//     }
    
//     update() {
//         const elements = this.holder.elements;
//         if (elements.length > 0) {
//             const boxes = elements.map(el => el.getBoundingClientRect());
//             const left = boxes.map(b => b.left).reduce((akk, left) => left < akk ? left : akk, window.innerWidth);
//             const top = boxes.map(b => b.top).reduce((akk, top) => top < akk ? top : akk, window.innerHeight);
//             const right = boxes.map(b => b.right).reduce((akk, right) => right > akk ? right : akk, 0);
//             const bottom = boxes.map(b => b.bottom).reduce((akk, bottom) => bottom > akk ? bottom : akk, 0);
//             if (this.svg && this.rect) {
//                 const { scrollLeft, scrollTop } = document.scrollingElement!;
//                 const artboardBox = this.artboard.svg.getBoundingClientRect();
//                 const artboardWidth = parseInt(this.artboard.svg.getAttribute('width')!);
//                 const artboardHeight = parseInt(this.artboard.svg.getAttribute('height')!);
//                 this.svg.setAttribute('width', String(this.zoom.value * artboardWidth));
//                 this.svg.setAttribute('height', String(this.zoom.value * artboardHeight));
//                 Object.assign(this.svg.style, {
//                     position: 'absolute',
//                     top: artboardBox.top + document.scrollingElement!.scrollTop + 'px',
//                     left: artboardBox.left + document.scrollingElement!.scrollLeft + 'px',
//                 });
//                 this.rect.setAttribute('x', String(left - 2 + scrollLeft));
//                 this.rect.setAttribute('y', String(top - 2 + scrollTop));
//                 this.rect.setAttribute('width', String((right - left + 3)));
//                 this.rect.setAttribute('height', String((bottom - top + 3)));
//                 this.rect.setAttribute('fill', 'none');
//                 this.rect.setAttribute('stroke', '#777');
//                 this.rect.setAttribute('stroke-width', '1');
//                 this.rect.setAttribute('stroke-dasharray', '1');
//             }
//         } else {
//             this.destroy();
//         }
//     }

//     destroy() {
//         if (this.svg) {
//             const tools = this.artboard.tools;
//             tools.removeChild(this.svg);
//             this.svg = null;
//             this.rect = null;
//         }
//         if (this.mousedownListener instanceof Function) {
//             this.mousedownListener();
//         }
//         if (this.mousemoveListener instanceof Function) {
//             this.mousemoveListener();
//         }
//         if (this.mouseupListener instanceof Function) {
//             this.mouseupListener();
//         }
//     }

// }
