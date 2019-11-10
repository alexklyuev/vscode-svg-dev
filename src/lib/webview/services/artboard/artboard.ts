/**
 * 
 */
export class Artboard {

    private selectionHost: Element | Document | ShadowRoot = document;

    private svgElement: SVGElement | null = null;

    private containerHtmlElement: HTMLElement | null = null;

    private toolsElement: HTMLElement | null = null;



    getSvgFn: () => SVGElement = () => {
        return this.selectionHost.querySelector('#artboard svg')! as SVGElement;
    }

    getBoxFn: () => HTMLElement = () => {
        return this.selectionHost.querySelector('#artboard')! as HTMLElement;
    }

    getToolsFn: () => HTMLElement = () => {
        return  this.selectionHost.querySelector('#tools')! as HTMLElement;
    }



    setSelectionHost(element: Element | Document | ShadowRoot) {
        this.selectionHost = element;
    }

    get svg(): SVGElement {
        if (!this.svgElement) {
            this.svgElement = this.getSvgFn();
        }
        return this.svgElement;
    }

    get box(): HTMLElement {
        if (!this.containerHtmlElement) {
            this.containerHtmlElement = this.getBoxFn();
        }
        return this.containerHtmlElement;
    }

    get tools(): HTMLElement {
        if (!this.toolsElement) {
            this.toolsElement = this.getToolsFn();
        }
        return this.toolsElement;
    }

    clearCache(): void {
        this.svgElement = null;
        this.containerHtmlElement = null;
        this.toolsElement = null;
    }

    get width(): number {
        return parseInt(this.svg.getAttribute('width')!);
    }

    get height(): number {
        return parseInt(this.svg.getAttribute('height')!);
    }

}
