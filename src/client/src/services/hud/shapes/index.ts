import { Shape } from "./shape";


const pathIcon = `
<svg width="8" height="8" viewBox="0 0 8 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="background: none;">
<g><circle fill="none" stroke="white" cx="1.776666666666665" cy="6.756666666666665" r="1" stroke-width=".5"></circle><path stroke="white" fill="none" d="M 2.9099999999999997 6.639999999999997 c 3.5999999999999996 -1.0999999999999996 -1.0999999999999994 -3.5500000000000003 2.450000000000001 -4.65" stroke-width=".5"></path><circle fill="none" stroke="white" cx="6.476666666666667" cy="2.006666666666666" r="1" stroke-width=".5"></circle></g></svg>
`;

const polygonIcon = `
<svg width="8" height="8" viewBox="0 0 8 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="background: none;">
<circle fill="none" stroke="white" cx="4.046666666666666" cy="6.736666666666666" r="1" stroke-width=".5"></circle><circle fill="none" stroke="white" cx="6.3966666666666665" cy="2.066666666666665" r="1" stroke-width=".5"></circle><circle fill="none" stroke="white" cx="1.7466666666666653" cy="2.066666666666665" r="1" stroke-width=".5"></circle><polygon stroke="white" fill="none" points="2.64,2.5000000000000004 4.02,5.68 5.48,2.48" stroke-width=".5" stroke-linecap="round" stroke-linejoin="round"></polygon></svg>
`;

const polylineIcon = `
<svg width="8" height="8" viewBox="0 0 8 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="background: none;">
<polyline stroke="white" fill="none" points="1.8666666666666667,3.1 4.133333333333334,5.566666666666666 6.266666666666667,3.1" stroke-width=".5" stroke-linecap="round" stroke-linejoin="round"></polyline><circle fill="none" stroke="white" cx="4.133333333333334" cy="6.716666666666667" r="1" stroke-width=".5"></circle><circle fill="none" stroke="white" cx="6.4833333333333325" cy="2.066666666666667" r="1" stroke-width=".5"></circle><circle fill="none" stroke="white" cx="1.8333333333333333" cy="2.066666666666667" r="1" stroke-width=".5"></circle></svg>
`;

const lineIcon = `
<svg width="8" height="8" viewBox="0 0 8 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="background: none;">
<circle fill="none" stroke="white" cx="1.776666666666665" cy="6.756666666666665" r="1" stroke-width=".5"></circle><circle fill="none" stroke="white" cx="6.476666666666667" cy="2.006666666666666" r="1" stroke-width=".5"></circle><line x1="2.36" y1="6.14" x2="5.88" y2="2.64" stroke="white" fill="none" stroke-width=".5"></line></svg>
`;

const rectIcon = `
<svg width="8" height="8" viewBox="0 0 8 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="background: none;">
        <rect fill="none" stroke="white" x="1.6333333333333333" y="2.75" width="5" height="5" stroke-width=".5"></rect></svg>
`;

const circleIcon = `
<svg width="8" height="8" viewBox="0 0 8 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="background: none;">
        <circle fill="none" stroke="white" cx="4.006666666666666" cy="4.733333333333333" r="3" stroke-width=".5"></circle></svg>
`;

const ellipseIcon = `
<svg width="8" height="8" viewBox="0 0 8 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="background: none;">
        <ellipse cx="4.08" cy="4.7" rx="2" ry="3" stroke="white" fill="none" stroke-width=".5"></ellipse></svg>
`;

const textIcon = `
<svg width="8" height="8" viewBox="0 0 8 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <rect fill="none" stroke="white" x="1.06" y="2.74" width="6" height="5" stroke-width=".5"></rect><line x1="2.84" y1="6.899999999999998" x2="2.82" y2="3.6400000000000006" stroke="white" fill="none" stroke-width=".5"></line></svg>
`;

export const pathShape = new Shape('path', pathIcon);
export const polygonShape = new Shape('polygon', polygonIcon);
export const polylineShape = new Shape('polyline', polylineIcon);
export const lineShape = new Shape('line', lineIcon);
export const rectShape = new Shape('rect', rectIcon);
export const circleShape = new Shape('circle', circleIcon);
export const ellipseShape = new Shape('ellipse', ellipseIcon);
export const textShape = new Shape('text', textIcon);