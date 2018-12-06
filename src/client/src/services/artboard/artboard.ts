/**
 * 
 */
export class Artboard {

    private svgElement: SVGElement | null = null;

    private containerHtmlElement: HTMLElement | null = null;

    private toolsElement: HTMLElement | null = null;

    constructor(
    ) {}

    get svg(): SVGElement {
        if (!this.svgElement) {
            this.svgElement = document.querySelector('#artboard svg')! as SVGElement;
        }
        return this.svgElement;
    }

    get box(): HTMLElement {
        if (!this.containerHtmlElement) {
            this.containerHtmlElement = document.querySelector('#artboard')! as HTMLElement;
        }
        return this.containerHtmlElement;
    }

    get tools(): HTMLElement {
        if (!this.toolsElement) {
            this.toolsElement = document.querySelector('#tools')! as HTMLElement;
        }
        return this.toolsElement;
    }

    clearCache(): void {
        this.svgElement = null;
        this.containerHtmlElement = null;
        this.toolsElement = null;
    }

}
