import { BaseBoxEditor } from "./base.box-editor";
// import { setState } from "&resolve/decorators/set-state.decorator";
import { setState } from "&resolve/decorators/set-state.decorator";


export class PolyBoxEditor extends BaseBoxEditor {

    private changex = false;
    private changey = false;

    /**
     * @override
     */
    @setState
    onMove(
        element: SVGElement,
        controlIndex: number,
        _event: MouseEvent,
        delta: [number, number],
        mirror: [boolean, boolean],
    ) {
        const pointsAttr = element.getAttribute('points')!;
        const pointsFlat = pointsAttr
        .split(/[,\s]+/)
        .map(c => parseFloat(c))
        ;
        const left = pointsFlat.filter((_p, index) => index % 2 === 0).reduce((acc, x) => x < acc ? x : acc, Number.MAX_VALUE);
        const top = pointsFlat.filter((_p, index) => index % 2 === 1).reduce((acc, y) => y < acc ? y : acc, Number.MAX_VALUE);
        const right = pointsFlat.filter((_p, index) => index % 2 === 0).reduce((acc, x) => x > acc ? x : acc, Number.MIN_VALUE);
        const bottom = pointsFlat.filter((_p, index) => index % 2 === 1).reduce((acc, y) => y > acc ? y : acc, Number.MIN_VALUE);
        const width = right - left;
        const height = bottom - top;
        const points = pointsFlat
        .reduce((acc, coord, index) => {
            if (index % 2 === 0) {
                acc.push([coord, NaN]);
            } else {
                acc[acc.length - 1][1] = coord;
            }
            return acc;
        }, Array<[number, number]>());
        const [ dx, dy ] = delta;
        let kw: number;
        let kh: number;

        const [mx, my] = mirror;

        const condx = width < 15 && !this.changex;
        const condy = height < 15 && !this.changey;

        if (condx) {
            kw = -1;
            mirror[0] = ! mx;
            this.changex = true;
        } else {
            kw = (width + dx) / width;
            this.changex = false;
        }

        if (condy) {
            kh = -1;
            mirror[1] = ! my;
            this.changey = true;
        } else {
            kh = (height + dy) / height;
            this.changey = false;
        }

        let newPoints: number[][] = points;

        const decX = (x: number) => (x - right) / kw + right;
        const decY = (y: number) => (y - bottom) / kh + bottom;

        const incX = (x: number) => (x - left) * kw + left;
        const incY = (y: number) => (y - top) * kh + top;

        switch (controlIndex) {
            case 0:
                newPoints = points.map(([x, y]) => [ mx ? incX(x) : decX(x), my ? incY(y) : decY(y) ]);
                break;
            case 1:
                newPoints = points.map(([x, y]) => [ x, my ? incY(y) : decY(y) ]);
                break;
            case 2:
                newPoints = points.map(([x, y]) => [ mx ? decX(x) : incX(x), my ? incY(y) : decY(y) ]);
                break;
            case 3:
                newPoints = points.map(([x, y]) => [ mx ? decX(x) : incX(x), y ]);
                break;
            case 4:
                newPoints = points.map(([x, y]) => [ mx ? decX(x) : incX(x), my ? decY(y) : incY(y) ]);
                break;
            case 5:
                newPoints = points.map(([x, y]) => [ x, my ? decY(y) : incY(y) ]);
                break;
            case 6:
                newPoints = points.map(([x, y]) => [ mx ? incX(x) : decX(x), my ? decY(y) : incY(y) ]);
                break;
            case 7:
                newPoints = points.map(([x, y]) => [ mx ? incX(x) : decX(x), y ]);
                break;
        }
        if (newPoints.some(ns => ns.some(n => !Number.isFinite(n)))) {
            return;
        }
        const newPointsStr = newPoints.map(pair => pair.join(',')).join(' ');
        element.setAttribute('points', newPointsStr);
    }

}
