import { MoverAbstract } from "@/webview/movers/mover-abstract";
import { pathPoints } from "@/webview/services/path";


export class MoverPath extends MoverAbstract {

  by(element: SVGElement, {x, y}: {x: number; y: number}) {
    const d = element.getAttribute('d')!;
    const dRel = pathPoints.setPointsRelative(d);
    const points = pathPoints.parseStr(dRel);
    const [ [ m, coords ] ] = points.splice(0, 1);
    const [mx, my] = coords.split(pathPoints.delimeter).map(v => parseFloat(v));
    points.unshift([m, `${ mx + x } ${ my + y }`]);
    const newD = points.map(section => section.join(' ')).join(' ');
    element.setAttribute('d', newD);
  }

}
