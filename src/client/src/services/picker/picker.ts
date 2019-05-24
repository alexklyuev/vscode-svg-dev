import { Artboard } from "../../services/artboard/artboard";
import { ElementHolder } from "./element-holder";
import { HostApi } from "../host-api/host-api.interface";
import { Zoom } from "../zoom/zoom";
import { FiguresCollection } from "../../figures/figures-collection";
import { setState } from "../../decorators/set-state.decorator";
import { UserEventManager } from "../user-event/user-event-manager";


export class Picker {

    private bindedMousemove: (event: MouseEvent) => void;
    private bindedMousedown: (event: MouseEvent) => void;
    private bindedMouseup: (event: MouseEvent) => void;

    private mousedownCallbacks = new Set<(event: MouseEvent) => void>();
    private mousemoveCallbacks = new Set<(event: MouseEvent) => void>();
    private mouseupCallbacks = new Set<(event: MouseEvent) => void>();

    /**
     * 
     * @param event 
     */
    onMousemove(event: MouseEvent) {
        this.controlPropagation(event);
        const { clientX, clientY } = event;
        this.holder.elements.forEach(element => {
            this.figuresCollection.delegate(element)!.drag.onMousemove(
                element,
                clientX,
                clientY,
            );
        });
        this.mousemoveCallbacks.forEach(cb => cb(event));
    }

    /**
     * 
     */
    onMousedown(event: MouseEvent) {
        this.controlPropagation(event);
        if (this.userEventMan.mode === 'interactive') {
            return;
        }
        let { target: eventTarget } = event;
        while (true) {
            if (eventTarget && eventTarget instanceof SVGElement && eventTarget.parentElement instanceof SVGGElement) {
                eventTarget = eventTarget.parentElement;
            } else {
                break;
            }
        }
        const pickableCtors = this.figuresCollection.getFiltered('drag').map(figure => figure.ctor);
        if (pickableCtors.some(Ctor => eventTarget instanceof Ctor)) {
            const target = eventTarget as SVGElement;
            const { elements } = this.holder;
            if (event.shiftKey) {
                if (elements.indexOf(target) === -1) {
                    this.holder.elements = elements.concat(target);
                } else {
                    this.holder.elements = this.holder.elements.filter(el => el !== target);
                }
            } else {
                if (this.holder.elements.indexOf(target) === -1) {
                    this.holder.elements = [target];
                } else {
                    this.holder.elements = elements;
                }
            }
            if (event.altKey) {
                const outer = target.outerHTML;
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g') as SVGGElement;
                g.innerHTML = outer;
                const copy = g.children[0];
                const svg = this.artboard.svg;
                svg.insertBefore(copy, target);
            }
            const { clientX, clientY } = event;
            this.holder.elements.forEach(element => {
                this.figuresCollection.delegate(element)!.drag.onMousedown(
                    element,
                    clientX,
                    clientY,
                );
            });
            this.artboard.svg.addEventListener('mousemove', this.bindedMousemove);
        } else {
            this.holder.elements = [];
        }
        this.mousedownCallbacks.forEach(cb => cb(event));
    }

    /**
     * 
     */
    @setState
    onMouseup(event: MouseEvent) {
        this.controlPropagation(event);
        const { clientX, clientY } = event;
        this.holder.elements.forEach(element => {
            this.figuresCollection.delegate(element)!.drag.onMouseup(
                element,
                clientX,
                clientY,
            );
        });
        this.artboard.svg.removeEventListener('mousemove', this.bindedMousemove);
        this.mouseupCallbacks.forEach(cb => cb(event));
    }

    constructor(
        private readonly artboard: Artboard,
        private readonly holder: ElementHolder,
        private figuresCollection: FiguresCollection,
        public readonly host: HostApi,
        public readonly zoom: Zoom,
        private userEventMan: UserEventManager,
    ) {
        this.bindedMousedown = this.onMousedown.bind(this);
        this.bindedMousemove = this.onMousemove.bind(this);
        this.bindedMouseup = this.onMouseup.bind(this);
    }

    /**
     * 
     */
    listen() {
        this.artboard.svg.addEventListener('mousedown', this.bindedMousedown);
        window.addEventListener('mouseup', this.bindedMouseup);
    }

    /**
     * 
     */
    addMousemoveCallback(callback: (event: MouseEvent) => void) {
        this.mousemoveCallbacks.add(callback);
        return () => this.mousemoveCallbacks.delete(callback);
    }

    /**
     * 
     */
    addMousedownCallback(callback: (event: MouseEvent) => void) {
        this.mousedownCallbacks.add(callback);
        return () => this.mousedownCallbacks.delete(callback);
    }

    /**
     * 
     */
    addMouseupCallback(callback: (event: MouseEvent) => void) {
        this.mouseupCallbacks.add(callback);
        return () => this.mouseupCallbacks.delete(callback);
    }

    /**
     * 
     */
    controlPropagation(event: MouseEvent) {
        if ( !(event.target instanceof SVGSVGElement) ) {
            event.stopPropagation();
        }
    }

}
