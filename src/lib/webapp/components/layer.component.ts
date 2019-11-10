export class LayerComponent extends HTMLElement {

    div: HTMLDivElement;
    svg: SVGSVGElement;

    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        this.div = document.createElement('div');
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        shadow.appendChild(this.div);
        this.div.appendChild(this.svg);
    }

    /**
     * @todo temporary method, should be removed in the future
     */
    replaceSvgDocument(svg: SVGSVGElement) {
        this.svg.remove();
        this.div.appendChild(svg);
        this.svg = svg;
    }

}
