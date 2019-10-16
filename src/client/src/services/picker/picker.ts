import { makeMethodIterator } from "@/common/iterators";
import { spawner } from "@/dom/spawner";
import { userEventMan } from "@/webview/services/user-event";
import { artboard } from "@/webview/services/artboard";

import { ElementHolder } from "./element-holder";
import { Zoom } from "../zoom/zoom";
import { FiguresCollection } from "../../figures/figures-collection";


export class Picker {

    private bindedMousemove: (event: MouseEvent) => void;
    private bindedMousedown: (event: MouseEvent) => void;
    private bindedMouseup: (event: MouseEvent) => void;

    /**
     * 
     * @param event 
     */
    @makeMethodIterator()
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
    @makeMethodIterator()
    onMousedown(event: MouseEvent) {
        if (userEventMan.mode === 'interactive') {
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
                const g = spawner.svg.create('g');
                g.innerHTML = outer;
                const copy = g.children[0] as SVGElement;
                copy.removeAttribute('id');
                const svg = artboard.svg;
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
            artboard.svg.addEventListener('mousemove', this.bindedMousemove);
        } else {
            this.holder.elements = [];
        }
        return event;
    }

    /**
     * 
     */
    @makeMethodIterator()
    onMouseup(event: MouseEvent) {
        this.controlPropagation(event);
        this.holder.elements.forEach(element => {
            this.figuresCollection.delegate(element)!.drag.onMouseup(
                element,
                event,
            );
        });
        artboard.svg.removeEventListener('mousemove', this.bindedMousemove);
        return event;
    }

    constructor(
        private readonly holder: ElementHolder,
        private figuresCollection: FiguresCollection,
        public readonly zoom: Zoom,
    ) {
        this.bindedMousedown = this.onMousedown.bind(this);
        this.bindedMousemove = this.onMousemove.bind(this);
        this.bindedMouseup = this.onMouseup.bind(this);
    }

    /**
     * 
     */
    listen() {
        artboard.box.addEventListener('mousedown', this.bindedMousedown);
        window.addEventListener('mouseup', this.bindedMouseup);
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
