import { MoverAbstract } from "./mover-abstract";


export class MoverPoints extends MoverAbstract {

  by(element: SVGElement, {x, y}: {x: number; y: number}) {
    const points = element.getAttribute('points')!;
    const vals = points.split(/[\s,]+/).map(v => parseFloat(v));
    const newVals = vals.map((v, i) => v + (i % 2 === 0 ? x : y));
    const newPoints = newVals.reduce((acc, val, index) => {
      return acc += `${ index % 2 === 0 ? ' ' : ',' }${ val }`;
    }, '').trim();
    element.setAttribute('points', newPoints);
  }

}
