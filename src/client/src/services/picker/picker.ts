import { Artboard } from "../../services/artboard/artboard";
import { ElementHolder } from "./element-holder";
import { HostApi } from "../host-api/host-api.interface";
import { Zoom } from "../zoom/zoom";
import { FiguresCollection } from "../../figures/figures-collection";
import { UserEventManager } from "../user-event/user-event-manager";
import { EventBus, connectEvent } from "../../../../lib/common/events";



const enum PickerEvents {
    mouseMove = 'mouseMoveEvent',
    mouseDown = 'mouseDownEvent',
    mouseUp = 'mouseUpEvent',
}


export class Picker {

    private bindedMousemove: (event: MouseEvent) => void;
    private bindedMousedown: (event: MouseEvent) => void;
    private bindedMouseup: (event: MouseEvent) => void;

    public readonly [PickerEvents.mouseDown] = new EventBus<MouseEvent>();
    public readonly [PickerEvents.mouseMove] = new EventBus<MouseEvent>();
    public readonly [PickerEvents.mouseUp] = new EventBus<MouseEvent>();

    /**
     * 
     * @param event 
     */
    @connectEvent(PickerEvents.mouseMove)
    onMousemove(event: MouseEvent) {
        this.controlPropagation(event);
        this.holder.elements.forEach(element => {
            this.figuresCollection.delegate(element)!.drag.onMousemove(
                element,
                event,
            );
        });
        return event;
    }

    /**
     * 
     */
    @connectEvent(PickerEvents.mouseDown)
    onMousedown(event: MouseEvent) {
        if (this.userEventMan.mode === 'interactive') {
            return event;
        }
        this.controlPropagation(event);
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
                const copy = g.children[0] as SVGElement;
                copy.removeAttribute('id');
                const svg = this.artboard.svg;
                svg.insertBefore(copy, target);
                target.insertAdjacentElement('afterend', copy);
                this.holder.elements = [copy];
            }
            this.holder.elements.forEach(element => {
                this.figuresCollection.delegate(element)!.drag.onMousedown(
                    element,
                    event,
                );
            });
            this.artboard.svg.addEventListener('mousemove', this.bindedMousemove);
        } else {
            this.holder.elements = [];
        }
        return event;
    }

    /**
     * 
     */
    // @setState
    @connectEvent(PickerEvents.mouseUp)
    onMouseup(event: MouseEvent) {
        this.controlPropagation(event);
        this.holder.elements.forEach(element => {
            this.figuresCollection.delegate(element)!.drag.onMouseup(
                element,
                event,
            );
        });
        this.artboard.svg.removeEventListener('mousemove', this.bindedMousemove);
        return event;
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
        this.artboard.box.addEventListener('mousedown', this.bindedMousedown);
        window.addEventListener('mouseup', this.bindedMouseup);
    }

    resetListeners() {

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
