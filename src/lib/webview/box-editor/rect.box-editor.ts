import { BaseBoxEditor } from './base.box-editor';
import { spawner } from '@/dom/spawner';


export class RectBoxEditor extends BaseBoxEditor {

    /**
     * @override
     */
    onMove(
        element: SVGElement,
        controlIndex: number,
        _event: MouseEvent,
        delta: [number, number],
        mirror: [boolean, boolean],
    ) {
        const [ dx, dy ] = delta;
        const [ mx, my ] = mirror;
        let x = parseFloat( element.getAttribute('x')! );
        let y = parseFloat( element.getAttribute('y')! );
        let width = parseFloat( element.getAttribute('width')! );
        let height = parseFloat( element.getAttribute('height')! );
        switch (controlIndex) {
            case 0:
                x += dx * (mx ? 0 : 1);
                width += dx * (mx ? 1 : -1);
                y += dy * (my ? 0 : 1);
                height += dy * (my ? 1 : -1);
                break;
            case 1:
                y += dy * (my ? 0 : 1);
                height += dy * (my ? 1 : -1);
                break;
            case 2:
                x += dx * (mx ? 1 : 0);
                width += dx * (mx ? -1 : 1);
                y += dy * (my ? 0 : 1);
                height += dy * (my ? 1 : -1);
                break;
            case 3:
                x += dx * (mx ? 1 : 0);
                width += dx * (mx ? -1 : 1);
                break;
            case 4:
                x += dx * (mx ? 1 : 0);
                width += dx * (mx ? -1 : 1);
                y += dy * (my ? 1 : 0);
                height += dy * (my ? -1 : 1);
                break;
            case 5:
                y += dy * (my ? 1 : 0);
                height += dy * (my ? -1 : 1);
                break;
            case 6:
                x += dx * (mx ? 0 : 1);
                width += dx * (mx ? 1 : -1);
                y += dy * (my ? 1 : 0);
                height += dy * (my ? -1 : 1);
                break;
            case 7:
                x += dx * (mx ? 0 : 1);
                width += dx * (mx ? 1 : -1);
                break;
        }
        if (width < 0) {
            width = -width;
            mirror[0] = !mx;
        }
        if (height < 0 ) {
            height = -height;
            mirror[1] = !my;
        }
        spawner.svg.update(element, {
            x: `${ x }`,
            y: `${ y }`,
            width: `${ width }`,
            height: `${ height }`,
        });
    }

}
