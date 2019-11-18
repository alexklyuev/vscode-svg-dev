export class ArtboardLayerComponent extends HTMLElement {

    private template = `
        <svgdev-layer></svgdev-layer>
    `;

    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = this.template;
    }

}
