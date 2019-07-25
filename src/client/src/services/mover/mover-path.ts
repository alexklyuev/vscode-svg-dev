import { MoverAbstract } from "./mover-abstract";
import { PathPoints } from "../path/path-points";

export class MoverPath extends MoverAbstract {

  constructor(
    private readonly pathPoints: PathPoints,
  ) {
    super();
  }

  by(element: SVGElement, {x, y}: {x: number; y: number}) {
    const d = element.getAttribute('d')!;
    const dRel = this.pathPoints.setPointsRelative(d);
    const points = this.pathPoints.parseStr(dRel);
    const [ [ m, coords ] ] = points.splice(0, 1);
    const [mx, my] = coords.split(this.pathPoints.delimeter).map(v => parseFloat(v));
    points.unshift([m, `${ mx + x } ${ my + y }`]);
    const newD = points.map(section => section.join(' ')).join(' ');
    element.setAttribute('d', newD);
  }

}
