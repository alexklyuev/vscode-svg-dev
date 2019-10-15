import { findMethodIterator } from "@/common/iterators";
import { CancelListener } from "../../../../client/src/listeners/cancel.listener";


export class EditPointsHub {

    private cancelFn: (() => void) | null = null;

    private innerElement: SVGElement | null = null;

    constructor(
        private cancelListner: CancelListener,
    ) {}

    isSameElement(element: SVGElement) {
        return element === this.innerElement;
    }

    purge() {
        this.takeActiveElement(null);
        this.takeCancelationFn(() => {});
    }

    takeActiveElement(element: SVGElement | null) {
        this.innerElement = element;
    }

    takeCancelationFn(fn: () => void) {
        const cancelEvents = findMethodIterator(this.cancelListner.eventReceived);
        if (this.cancelFn instanceof Function) {
            cancelEvents.return! ();
            this.cancelFn();
        }
        this.cancelFn = fn;
        (async () => {
            for await (const _event of cancelEvents) {
                if (this.cancelFn instanceof Function) {
                    this.cancelFn();
                }
            }
        })();
    }

}
