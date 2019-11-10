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

}
