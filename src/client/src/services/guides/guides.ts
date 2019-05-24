import { Artboard } from "../artboard/artboard";


export class Guides {
    private container: SVGSVGElement | null = null;

    constructor(
        private artboard: Artboard,
    ) {}

    get exists(): boolean {
        return !!this.container;
    }

    create() {
        this.container = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.artboard.tools.appendChild(this.container);
        this.setStyles();
    }

    destroy() {
        if (this.container) {
            this.artboard.tools.removeChild(this.container);
            this.container = null;
        }
    }

    setStyles(): void {
        if (this.container && this.artboard) {
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

    drawBox(elements: Element[]): void {
        if (this.container) {
            const box = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            const rects = elements.map(el => el.getBoundingClientRect());
            const left = rects.map(({ left }) => left).reduce((acc, left) => left < acc ? left : acc, Infinity);
            const top = rects.map(({ top }) => top).reduce((acc, top) => top < acc ? top : acc, Infinity);
            const right = rects.map(({ right }) => right).reduce((acc, right) => right > acc ? right : acc, -Infinity);
            const bottom = rects.map(({ bottom }) => bottom).reduce((acc, bottom) => bottom > acc ? bottom : acc, -Infinity);
            const { left: containerLeft, top: containerTop } = this.container.getBoundingClientRect();
            this.container.appendChild(box);
            box.setAttribute('x', `${ left - containerLeft - 1 }`);
            box.setAttribute('y', `${ top - containerTop - 1 }`);
            box.setAttribute('width', `${ right - left + 1 }`);
            box.setAttribute('height', `${ bottom - top + 1 }`);
            Object.assign(box.style, {
                strokeColor: 'blue',
                strokeWidth: '1px',
            });
        }
    }

    disposeAllChildren(): void {
        if (this.container) {
            for (let i = 0; i < this.container.children.length; i++) {
                const el = this.container.children[i];
                this.container.removeChild(el);
            }
        }
    }

}
