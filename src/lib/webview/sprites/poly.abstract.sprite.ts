
// import { draggerPoints } from "@/webview/draggers";
// import { moverPoints } from "@/webview/movers";
// import { Sprite } from "@/webview/models/sprite.model";
// import { polyPointsEditor } from "@/webview/points-editor";
// import { polyBoxEditor } from "../box-editor";


// export abstract class PolySprite implements Sprite<SVGElement> {

//     abstract readonly name: string;
//     abstract readonly ctor = SVGElement;

//     abstract stroke: string;
//     abstract fill: string;

//     // public readonly dragOperator = draggerPoints;
//     // public readonly moveOperator = moverPoints;
//     // public readonly editPointsOperator = polyPointsEditor;
//     // public readonly editBoxOperator = polyBoxEditor;


//     // @setState
//     // create(_elementName: string, _attributest: {[K: string]: string}) {
//     //     // let points = Array<[[number, number], [number, number]]>();
//     //     let cpoints = Array<PointConcerns>();
//     //     artboard.box.classList.add('interactive-points');
//     //     let toolsSvgRemover: null | (() => void) = null;
//     //     userEventMan.mode = 'interactive';
//     //     const pointsListener = (event: MouseEvent) => {
//     //         const { clientX, clientY, shiftKey } = event;
//     //         const { scrollLeft, scrollTop } = document.scrollingElement!;
//     //         // const point: [[number, number], [number, number]] = [
//     //         //     [clientX, scrollLeft],
//     //         //     [clientY, scrollTop],
//     //         // ];
//     //         const cpoint: PointConcerns = {
//     //             client: [clientX, clientY],
//     //             scroll: [scrollLeft, scrollTop],
//     //             margin: [artboardMove.left, artboardMove.top],
//     //             board: [artboard.width, artboard.height],
//     //             zoom: zoom.value,
//     //         };
//     //         if (cpoints.length > 0 && shiftKey) {
//     //             // const [[cx,], [cy,]] = points[points.length - 1];
//     //             const { client: [cx, cy] } = cpoints[cpoints.length - 1];
//     //             const deltax = Math.abs(clientX - cx);
//     //             const deltay = Math.abs(clientY - cy);
//     //             if (deltax < deltay) {
//     //                 cpoint.client[0] = cx;
//     //             } else {
//     //                 cpoint.client[1] = cy;
//     //             }
//     //         }
//     //         cpoints.push(cpoint);
//     //         if (toolsSvgRemover instanceof Function) {
//     //             toolsSvgRemover();
//     //             toolsSvgRemover = null;
//     //         }
//     //         toolsSvgRemover = this.renderTools(cpoints);
//     //     };
//     //     window.addEventListener('click', pointsListener);
//     //     const cancelEvents = findMethodIterator(cancelListener.eventReceived);
//     //     const stop = (_key: CancelKeys) => {
//     //         window.removeEventListener('click', pointsListener);
//     //         // cancelListener.keyEvent.off(stop);
//     //         cancelEvents.return! ();
//     //         artboard.box.classList.remove('interactive-points');
//     //         if (toolsSvgRemover instanceof Function) {
//     //             toolsSvgRemover();
//     //             toolsSvgRemover = null;
//     //         }
//     //         userEventMan.mode = 'pick';
//     //         this.render(cpoints);
//     //     };
//     //     // cancelListener.keyEvent.on(stop);
//     //     (async () => {
//     //         for await (const key of cancelEvents) {
//     //             stop(key);
//     //             cancelEvents.return! ();
//     //         }
//     //     })();
//     // }

//     // render(points: Array<PointConcerns>) {
//     //     const element = document.createElementNS('http://www.w3.org/2000/svg', this.name);
//     //     element.setAttribute('stroke', appearance.stroke);
//     //     element.setAttribute('fill', appearance.fill);
//     //     // element.setAttribute('points', points.map(([[cX, sX], [cY, sY]]) => {
//     //     //     return `${(cX + sX) / zoom.value},${(cY + sY) / zoom.value}`;
//     //     // }).join(' '));
//     //     element.setAttribute('points', points.map(({ client, scroll, margin, board, zoom }) => {
//     //         const [x, y] = [0, 1].map(dim => {
//     //             return (client[dim] + scroll[dim] - margin[dim] + board[dim] * (zoom - 1) / 2) / zoom;
//     //         });
//     //         return `${ x },${ y }`;
//     //     }).join(' '));
//     //     artboard.svg.appendChild(element);
//     // }

//     // renderTools(points: Array<PointConcerns>) {
//     //     const { scrollLeft, scrollTop } = document.scrollingElement!;
//     //     const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
//     //     const artboardBox = artboard.svg.getBoundingClientRect();
//     //     const artboardWidth = parseInt(artboard.svg.getAttribute('width')!);
//     //     const artboardHeight = parseInt(artboard.svg.getAttribute('height')!);
//     //     svg.setAttribute('width', String(zoom.value * artboardWidth));
//     //     svg.setAttribute('height', String(zoom.value * artboardHeight));
//     //     Object.assign(svg.style, {
//     //         position: 'absolute',
//     //         top: artboardBox.top + scrollTop + 'px',
//     //         left: artboardBox.left + scrollLeft + 'px',
//     //     });
//     //     artboard.tools.appendChild(svg);
//     //     points.forEach(({ client, scroll, margin, board, zoom }, index) => {
//     //         const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
//     //         const [cx, cy] = [0, 1].map(d => {
//     //             return client[d] + scroll[d] - margin[d] + board[d] * (zoom - 1) / 2;
//     //         });
//     //         circle.setAttribute('cx', `${cx}`);
//     //         circle.setAttribute('cy', `${cy}`);
//     //         circle.setAttribute('r', `${3}`);
//     //         circle.setAttribute('fill', 'none');
//     //         circle.setAttribute('stroke', '#777');
//     //         circle.setAttribute('stroke-dasharray', '1');
//     //         svg.appendChild(circle);
//     //         if (index > 0) {
//     //             const {
//     //                 client: pclient,
//     //                 scroll: pscroll,
//     //                 margin: pmargin,
//     //                 board: pboard,
//     //                 zoom: pzoom,
//     //             } = points[index - 1];
//     //             const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
//     //             const [x1, y1] = [0, 1].map(d => {
//     //                 return pclient[d] + pscroll[d] - pmargin[d] + pboard[d] * (pzoom - 1) / 2;
//     //             });
//     //             const attrs: {[K: string]: string} = {
//     //                 'stroke': '#777',
//     //                 'stroke-dasharray': '1',
//     //                 'x1': `${x1}`,
//     //                 'y1': `${y1}`,
//     //                 'x2': `${cx}`,
//     //                 'y2': `${cy}`,
//     //             };
//     //             Object.keys(attrs).forEach(key => {
//     //                 const val = attrs[key];
//     //                 line.setAttribute(key, val);
//     //             });
//     //             svg.appendChild(line);
//     //         }
//     //     });
//     //     let mousemoveRemover = () => {};
//     //     if (points.length > 0) {
//     //         // const [[cX, sX], [cY, sY]] = points[points.length - 1];
//     //         const {
//     //             client,
//     //             scroll,
//     //             margin,
//     //             board,
//     //             zoom,
//     //         } = points[points.length - 1];
//     //         const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
//     //         svg.appendChild(line);
//     //         const [x, y] = [0, 1].map(d => {
//     //             return client[d] + scroll[d] - margin[d] + board[d] * (zoom - 1) / 2;
//     //         });
//     //         const attrs: {[K: string]: string} = {
//     //             'stroke': '#777',
//     //             'stroke-dasharray': '1',
//     //             'x1': `${x}`,
//     //             'y1': `${y}`,
//     //             'x2': `${x}`,
//     //             'y2': `${y}`,
//     //         };
//     //         Object.keys(attrs).forEach(key => {
//     //             const val = attrs[key];
//     //             line.setAttribute(key, val);
//     //         });
//     //         const onMousemove = (event: MouseEvent) => {
//     //             const { clientX, clientY, shiftKey } = event;
//     //             const nclient = [clientX, clientY];
//     //             const { scrollLeft, scrollTop } = document.scrollingElement!;
//     //             const nscroll = [scrollLeft, scrollTop];
//     //             const [x2, y2] = [0, 1].map(d => {
//     //                 return nclient[d] + nscroll[d] - margin[d] + board[d] * (zoom - 1) / 2;
//     //             });
//     //             const points: {[K: string]: string} = {
//     //                 'x2': `${ x2 }`,
//     //                 'y2': `${ y2 }`,
//     //             };
//     //             if (shiftKey) {
//     //                 const absDeltaX = Math.abs(clientX - client[0]);
//     //                 const absDeltaY = Math.abs(clientY - client[1]);
//     //                 if (absDeltaX < absDeltaY) {
//     //                     const x2 = client[0] + scroll[0] - margin[0] + board[0] * (zoom - 1) / 2;
//     //                     points.x2 = `${ x2 }`;
//     //                 } else {
//     //                     const y2 = client[1] + scroll[1] - margin[1] + board[1] * (zoom - 1) / 2;
//     //                     points.y2 = `${ y2 }`;
//     //                 }
//     //             }
//     //             Object.keys(points).forEach(key => {
//     //                 const val = points[key];
//     //                 line.setAttribute(key, val);
//     //             });
//     //         };
//     //         window.addEventListener('mousemove', onMousemove);
//     //         mousemoveRemover = () => window.removeEventListener('mousemove', onMousemove);
//     //     }
//     //     return () => {
//     //         mousemoveRemover();
//     //         artboard.tools.removeChild(svg);
//     //     };
//     // }

// }
