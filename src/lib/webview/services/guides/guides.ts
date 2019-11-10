import { EventBus, connectEvent } from "@/common/events";
import { spawner } from "@/dom/spawner";
import { artboard } from "@/webview/services/artboard";


const enum GuidesEvents {
    selectionDrawn = 'selectionDrawn',
    selectionDestroyed = 'selectionDestroyed',
}


/**
 * 
 */
export class Guides {
    private readonly borderStyle = '1px dotted #666';

    private container: SVGSVGElement | null = null;
    private selection: SVGRectElement | null = null;

    public readonly [GuidesEvents.selectionDrawn] = new EventBus<ClientRect>();
    public readonly [GuidesEvents.selectionDestroyed] = new EventBus<null>();

    async * aiDrawn(): AsyncIterableIterator<ClientRect> {
        return yield * {
            [Symbol.asyncIterator]: () => {
                return {
                    next: () => {
                        return new Promise<IteratorResult<ClientRect>>(resolve => {
                            this[GuidesEvents.selectionDrawn].once(value => {
                                resolve({ value, done: false });
                            });
                        });
                    },
                };
            },
        };
    }

    /**
     * 
     */
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
        this.container = spawner.svg.svg();
        artboard.tools.appendChild(this.container);
        this.setContainerStyles();
    }

    /**
     * 
     */
    setContainer(container: SVGSVGElement) {
        this.container = container;
    }

    /**
     * 
     */
    setContainerStyles(source = artboard.svg) {
        if (this.container) {
            const { left, top, width, height } = source.getBoundingClientRect();
            spawner.svg.update(this.container, {}, {
                position: 'absolute',
                border: this.borderStyle,
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
            artboard.tools.removeChild(this.container);
            this.container = null;
        }
    }

    /**
     * 
     */
    drawSelection(elements: Element[]): void {
        if (this.container) {
            this.selection = spawner.svg.rect();
            const firstChild = this.container.children[0];
            if (firstChild) {
                firstChild.insertAdjacentElement('beforebegin', this.selection);
            } else {
                this.container.appendChild(this.selection);
            }
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
            if ( [left, top, bottom, right].every(d => Number.isFinite(d)) ) {
                spawner.svg.update(this.selection, {
                    'x': `${ left - containerLeft - 1 }`,
                    'y': `${ top - containerTop - 1 }`,
                    'width': `${ right - left + 1 }`,
                    'height': `${ bottom - top + 1 }`,
                    'fill': 'none',
                    'stroke': 'blue',
                    'stroke-width': '1',
                    'stroke-dasharray': '1',
                });
                this.selectionStylesIsSet();
            }
        }
    }

    /**
     * 
     */
    @connectEvent(GuidesEvents.selectionDrawn)
    selectionStylesIsSet() {
        return this.selection!.getBoundingClientRect();
    }

    /**
     * 
     */
    removeSelection(): void {
        if (this.container && this.selection) {
            this.container.removeChild(this.selection);
            this.selection = null;
            this.selectionIsRemoved();
        }
    }

    /**
     * 
     */
    @connectEvent(GuidesEvents.selectionDestroyed)
    selectionIsRemoved() {
        return null;
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

    /**
     * 
     */
    appendControlPoint(element: SVGElement) {
        if (this.selection) {
            this.selection.insertAdjacentElement('afterend', element);
        } else if (this.container) {
            this.container.appendChild(element);
        } else {
            throw new Error('Guides: cannot append control point');
        }
    }

}
