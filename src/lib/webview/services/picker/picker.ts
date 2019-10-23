import { makeMethodIterator } from "@/common/iterators";
import { spawner } from "@/dom/spawner";
import { userEventMan } from "@/webview/services/user-event";
import { artboard } from "@/webview/services/artboard";
import { holder } from "@/webview/services/holder";
import { sprites } from "@/webview/services/sprites";


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
        holder.elements.forEach(element => {
            sprites.resolve(element)!.drag.onMousemove(
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
        const pickableCtors = sprites.getFiltered('drag').map(figure => figure.ctor);
        if (pickableCtors.some(Ctor => eventTarget instanceof Ctor)) {
            const target = eventTarget as SVGElement;
            const { elements } = holder;
            if (event.shiftKey) {
                if (elements.indexOf(target) === -1) {
                    holder.elements = elements.concat(target);
                } else {
                    holder.elements = holder.elements.filter(el => el !== target);
                }
            } else {
                if (holder.elements.indexOf(target) === -1) {
                    holder.elements = [target];
                } else {
                    holder.elements = elements;
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
                holder.elements = [copy];
            }
            holder.elements.forEach(element => {
                sprites.resolve(element)!.drag.onMousedown(
                    element,
                    event,
                );
            });
            artboard.svg.addEventListener('mousemove', this.bindedMousemove);
        } else {
            holder.elements = [];
        }
        return event;
    }

    /**
     * 
     */
    @makeMethodIterator()
    onMouseup(event: MouseEvent) {
        this.controlPropagation(event);
        holder.elements.forEach(element => {
            sprites.resolve(element)!.drag.onMouseup(
                element,
                event,
            );
        });
        artboard.svg.removeEventListener('mousemove', this.bindedMousemove);
        return event;
    }

    constructor() {
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
