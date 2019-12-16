import { makeMethodIterator } from "@/common/iterators";

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

    connectedCallback() {
        return this.connected();
    }

    @makeMethodIterator()
    connected() {
        return this;
    }

    /**
     * @todo temporary method, should be removed in the future
     */
    replaceSvgDocument(svg: SVGSVGElement | string) {
        this.svg.remove();
        if (svg instanceof SVGSVGElement) {
            this.div.appendChild(svg);
            this.svg = svg;
        }
        if (typeof svg === 'string') {
            this.div.innerHTML = svg;
            this.svg = this.div.childNodes[0] as SVGSVGElement;
        }
    }

}
