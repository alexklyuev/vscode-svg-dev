import { Artboard } from "../../services/artboard/artboard";

export class Rect {

    constructor(
        private artboard: Artboard,
    ) {}

    create() {
        const svg = this.artboard.svg;
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect') as SVGRectElement;
        svg.appendChild(rect);
        rect.setAttribute('x', '50');
        rect.setAttribute('y', '50');
        rect.setAttribute('width', '50');
        rect.setAttribute('height', '50');
        rect.setAttribute('stroke', '#ffffff');
        rect.setAttribute('fill', '#ccc');
    }

}