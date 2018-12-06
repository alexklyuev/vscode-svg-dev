import { Artboard } from "../../services/artboard/artboard";


export class Circle {

    constructor(
        private artboard: Artboard,
    ) {}

    create() {
        const svg = this.artboard.svg;
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle') as SVGCircleElement;
        svg.appendChild(circle);
        circle.setAttribute('cx', '50');
        circle.setAttribute('cy', '50');
        circle.setAttribute('r', '30');
        circle.setAttribute('stroke', '#ffffff');
        circle.setAttribute('fill', '#ccc');
    }

}