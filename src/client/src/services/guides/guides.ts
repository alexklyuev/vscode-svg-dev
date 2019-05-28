import { Artboard } from "../artboard/artboard";
import { ClientEvent } from "../../entities/client-event";


/**
 * 
 */
export class Guides {

    private container: SVGSVGElement | null = null;
    private selection: SVGRectElement | null = null;

    public readonly selectionDrawn = new ClientEvent<ClientRect>();
    public readonly selectionDestroyed = new ClientEvent<null>();

    constructor(
        private artboard: Artboard,
    ) {}

    get guidesContainer(): SVGSVGElement | null {
        return this.container;
    }

    /**
     * 
     */
    get exists(): boolean {
        return !!this.container;
    }

    /**
     * 
     */
    createContainer() {
        this.container = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.artboard.tools.appendChild(this.container);
        this.setContainerStyles();
    }

    setContainerStyles() {
        if (this.container) {
            const { left, top, width, height } = this.artboard.svg.getBoundingClientRect();
            Object.assign(this.container.style, {
                position: 'absolute',
                border: '1px dotted blue',
                left: `${ left - 0.5 }px`,
                top: `${ top - 0.5 }px`,
                width: `${ width }px`,
                height: `${ height }px`,
            });
        }
    }

    /**
     * 
     */
    destroyContainer() {
        if (this.container) {
            this.artboard.tools.removeChild(this.container);
            this.container = null;
        }
    }

    /**
     * 
     */
    drawSelection(elements: Element[]): void {
        if (this.container) {
            this.selection = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            this.container.appendChild(this.selection);
            this.setSelectionStyles(elements);
        }
    }

    /**
     * 
     */
    setSelectionStyles(elements: Element[]): void {
        if (this.container && this.selection) {
            const rects = elements.map(el => el.getBoundingClientRect());
            const left = rects.map(({ left }) => left).reduce((acc, left) => left < acc ? left : acc, Infinity);
            const top = rects.map(({ top }) => top).reduce((acc, top) => top < acc ? top : acc, Infinity);
            const right = rects.map(({ right }) => right).reduce((acc, right) => right > acc ? right : acc, -Infinity);
            const bottom = rects.map(({ bottom }) => bottom).reduce((acc, bottom) => bottom > acc ? bottom : acc, -Infinity);
            const { left: containerLeft, top: containerTop } = this.container.getBoundingClientRect();
            this.selection.setAttribute('x', `${ left - containerLeft - 1 }`);
            this.selection.setAttribute('y', `${ top - containerTop - 1 }`);
            this.selection.setAttribute('width', `${ right - left + 1 }`);
            this.selection.setAttribute('height', `${ bottom - top + 1 }`);
            this.selection.setAttribute('fill', 'none');
            this.selection.setAttribute('stroke', 'blue');
            this.selection.setAttribute('stroke-width', '1');
            this.selection.setAttribute('stroke-dasharray', '1');
            this.selectionDrawn.emit(this.selection.getBoundingClientRect());
        }
    }

    /**
     * 
     */
    removeSelection(): void {
        if (this.container && this.selection) {
            this.container.removeChild(this.selection);
            this.selection = null;
            this.selectionDestroyed.emit(null);
        }
    }

    /**
     * 
     */
    disposeContainerChildren(): void {
        if (this.container) {
            for (let i = 0; i < this.container.children.length; i++) {
                const el = this.container.children[i];
                this.container.removeChild(el);
            }
        }
    }

}
