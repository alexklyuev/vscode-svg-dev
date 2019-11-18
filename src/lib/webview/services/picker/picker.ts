import { makeMethodIterator } from "@/common/iterators";
import { userEventMan } from "@/webview/services/user-event";
import { artboard } from "@/web/init";
import { holder } from "@/webview/services/holder";
import { sprites } from "@/webview/services/sprites";


export class Picker {

    private bindedMousemove: (event: MouseEvent) => void;
    private bindedMousedown: (event: MouseEvent) => void;
    private bindedMouseup: (event: MouseEvent) => void;

    /**
     * 
     */
    @makeMethodIterator()
    onMousemove(event: MouseEvent) {
        this.controlPropagation(event);
        holder.elements.forEach(element => {
            sprites.resolve(element)!.operators.dragOperator!.onMousemove(
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
        const {
            altKey,
            shiftKey,
        } = event;
        let { target: eventTarget } = event;

        if (eventTarget instanceof SVGSVGElement) {
            holder.elements = [];
            return event;
        }

        while (true) {
            if (
                eventTarget
                &&
                eventTarget instanceof SVGElement
                &&
                eventTarget.parentElement instanceof SVGGElement
            ) {
                eventTarget = eventTarget.parentElement;
            } else {
                break;
            }
        }

        const target = eventTarget as SVGElement;

        const { elements } = holder;

        if (shiftKey) {
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

        if (altKey) {
            const newEls = holder.elements
            .map(el => {
                const sprite = sprites.resolve(el);
                if (sprite) {
                    const { copyOperator } = sprite.operators;
                    if (copyOperator) {
                        return copyOperator.copy(el);
                    }
                }
            })
            .filter(el => el instanceof SVGElement) as SVGElement[];
            holder.elements = newEls;
        }

        holder.elements.forEach(element => {
            sprites.resolve(element)!.operators.dragOperator!.onMousedown(
                element,
                event,
            );
        });

        artboard.svg.addEventListener('mousemove', this.bindedMousemove);

        return event;
    }

    /**
     * 
     */
    @makeMethodIterator()
    onMouseup(event: MouseEvent) {
        this.controlPropagation(event);
        holder.elements.forEach(element => {
            sprites.resolve(element)!.operators.dragOperator!.onMouseup(
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
    on() {
        artboard.box.addEventListener('mousedown', this.bindedMousedown);
        window.addEventListener('mouseup', this.bindedMouseup);
    }

    /**
     * 
     */
    off() {
        artboard.box.removeEventListener('mousedown', this.bindedMousedown);
        window.removeEventListener('mouseup', this.bindedMouseup);
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
