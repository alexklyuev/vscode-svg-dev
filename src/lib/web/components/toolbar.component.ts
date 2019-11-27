export class ToolbarComponent extends HTMLElement {

    private template = `
        <style>
            :host {
                position: absolute;
                z-index: 1;
                user-select: none;
            }
        </style>
        <svgdev-zoom-command></svgdev-zoom-command>
        <svgdev-create-commands></svgdev-create-commands>
        <svgdev-edit></svgdev-edit>
    `;

    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = this.template;
    }

}
