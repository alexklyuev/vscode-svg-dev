import { BasePointsEditor } from "@/webview/points-editor/base.points-editor";
import { pathPoints } from "@/webview/services/path";
import { spawner } from "@/dom/spawner";
import { appearance } from "@/webview/services/appearance";
import { zoom } from "@/webview/services/zoom";
import { guides } from "@/webview/services/guides";


export class PathPointsEditor extends BasePointsEditor<SVGPathElement> {

    private pointTypeMap = Array<boolean>();
    private selfControls = Array<boolean>();

    getPoints(element: SVGPathElement): [number, number][] {
        const points = Array<[number, number]>();
        const d = element.getAttribute('d')!;
        const dirs = pathPoints.parseStr(d);
        const allDims = pathPoints.getAllAbsCoords(dirs);
        let i = -1;
        allDims.forEach((dim, _dimIndex) => {
            dim.forEach((pair, pairIndex) => {
                i++;
                const [ x, y ] = pair;
                const isPoint = pairIndex === (dim.length - 1);
                const selfControl = isPoint ? false : (pairIndex === dim.length - 2);
                // points.push([x, y]);
                points[i] = [x, y];
                this.pointTypeMap[i] = isPoint;
                this.selfControls[i] = selfControl;
            });
        });
        // console.log(JSON.stringify(points, null, 2));
        // console.log(JSON.stringify(this.pointTypeMap, null, 2));
        // console.log(JSON.stringify(this.selfControls, null, 2));
        return points;
    }

    onMove(
        element: SVGPathElement,
        circleIndex: number,
        relDelta: [number, number],
        _mirror: [boolean, boolean],
        event: MouseEvent,
    ) {
        const { altKey } = event;
        const [ dx, dy ] = relDelta;
        const d = element.getAttribute('d')!;
        const points = pathPoints.parseStr(d);
        const newPoints = points
        .map(([command, coords], pointIndex) => {
            if (circleIndex !== pointIndex) {
                return `${ command } ${ coords }`;
            } else {
                let newCoords = coords.split(pathPoints.delimeter).map(c => parseFloat(c));
                const isPoint = this.pointTypeMap[circleIndex];
                const selfControl = this.selfControls[circleIndex];
                console.log(circleIndex);
                console.log(isPoint);
                console.log(selfControl);
                if (!isPoint) {
                    if (selfControl) {
                        newCoords[newCoords.length - 4] += dx;
                        newCoords[newCoords.length - 3] += dy;
                    } else {
                        newCoords[newCoords.length - 6] += dx;
                        newCoords[newCoords.length - 5] += dy;
                    }
                } else {
                    if (altKey) {
                        newCoords = newCoords.map((c, ci) => c + [dx, dy][ci % 2]);
                    } else {
                        newCoords[newCoords.length - 2] += dx;
                        newCoords[newCoords.length - 1] += dy;
                    }
                }
                return `${ command } ${ newCoords.join(' ') }`;
            }
        })
        .join(' ');
        element.setAttribute('d', newPoints);
    }

    /**
     * @override
     */
    edit(element: SVGPathElement) {
        const d = element.getAttribute('d')!;
        const newD = pathPoints.setPointsAbsolute(d);
        element.setAttribute('d', newD);
        return super.edit(element);
    }

    /**
     * @override
     */
    createCircles(points: number[][]) {
        return points.map((point, pointIndex) => {
            const isPoint = this.pointTypeMap[pointIndex];
            const [ cx, cy ] = point;
            const { value: zoomValue } = zoom;
            const circle = spawner.svg.circle(
                {
                    cx: `${ cx * zoomValue }`,
                    cy: `${ cy * zoomValue }`,
                    fill: isPoint ? appearance.editControlPointFill : appearance.editBezierPointFill,
                    stroke:isPoint ? appearance.editControlPointStroke : appearance.editBezierPointStroke,
                    'stroke-dasharray': appearance.editControlPointStrokeDasharray,
                    r: isPoint ? appearance.editControlPointRadius: appearance.editBezierPointRadius,
                },
                {
                    pointerEvents: 'fill',
                }
            );
            guides.appendControlPoint(circle);
            return circle;
        });
    }

}
