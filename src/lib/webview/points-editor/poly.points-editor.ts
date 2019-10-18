import { BasePointsEditor } from "@/webview/points-editor/base.points-editor";


export class PolyPointsEditor extends BasePointsEditor<SVGElement> {

    getPoints(element: SVGElement) {
        const points = element.getAttribute('points')!;
        return points.split(/[,\s]+/).map(c => parseFloat(c))
        .reduce((acc, coord, index) => {
            if (index % 2 === 0) {
                acc.push([coord, NaN]);
            } else {
                acc[acc.length - 1][1] = coord;
            }
            return acc;
        }, Array<[number, number]>());
    }

    onMove(
        element: SVGElement,
        circleIndex: number,
        relDelta: [number, number],
        _mirror: [boolean, boolean],
        event: MouseEvent,
    ) {
        const [ dx, dy ] = relDelta;
        let p0 = element.getAttribute('points')!;
        const points$ = p0.split(/[,\s]+/).map(c => parseFloat(c))
        .reduce((acc, coord, index) => {
            if (index % 2 === 0) {
                acc.push([coord, NaN]);
            } else {
                acc[acc.length - 1][1] = coord;
            }
            return acc;
        }, Array<[number, number]>())
        .map((pair1, pairIndex1) => {
            if (circleIndex !== pairIndex1) {
                return pair1.join(',');
            } else {
                const [x, y] = pair1;
                return [
                    x + dx,
                    y + dy,
                ].join(',');
            }
        })
        .join(' ');
        element.setAttribute('points', points$);
    }

}
