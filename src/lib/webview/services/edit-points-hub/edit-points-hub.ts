import { findMethodIterator } from "@/common/iterators";
import { figuresCollection } from "@/webview/services/figures-collection";
import { cancelListener } from "@/webview/listeners";


export class EditPointsHub {

    private cancelFn: (() => void) | null = null;

    private innerElement: SVGElement | null = null;

    /**
     * //
     */
    startEditing(element: SVGElement | null) {
        if (element) {
            if (!this.isSameElement(element)) {
                this.takeActiveElement(element);
                const delegate = figuresCollection.delegate(element);
                if (delegate && delegate.edit instanceof Function) {
                    const cancelFn = delegate.edit(element);
                    if (cancelFn instanceof Function) {
                        this.takeCancelationFn(cancelFn);
                    }
                }
            }
        } else {
            this.purge();
        }
    }

    isSameElement(element: SVGElement) {
        return element === this.innerElement;
    }

    purge() {
        this.takeActiveElement(null);
        this.takeCancelationFn(() => void 0);
    }

    takeActiveElement(element: SVGElement | null) {
        this.innerElement = element;
    }

    takeCancelationFn(fn: () => void) {
        const cancelEvents = findMethodIterator(cancelListener.eventReceived);
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
