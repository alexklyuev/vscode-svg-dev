import { findMethodIterator, makeMethodIterator } from "@/common/iterators";
import { sprites } from "@/webview/services/sprites";
import { cancelListener } from "@/webview/listeners";
import { EditMode } from "@/shared/pipes/edit-mode.pipe";


export class EditHub {

    private cancelFn: (() => void) | null = null;

    private innerElement: SVGElement | null = null;

    private innerElementMode: EditMode | null = null;

    get element(): SVGElement | null {
        return this.innerElement;
    }

    private editModeInner: EditMode = 'off';

    get editMode(): EditMode {
        return this.editModeInner;
    }

    set editMode(val: EditMode) {
        this.editModeInner = val;
        this.editModeSet(val);
        if (val === 'off') {
            this.purge();
        }
    }

    @makeMethodIterator()
    editModeSet(val: EditMode): EditMode {
        return val;
    }

    @makeMethodIterator()
    dispatchEditMode(mode: EditMode) {
        this.editMode = mode;
        return mode;
    }

    /**
     * //
     */
    startEditing(element: SVGElement | null) {
        if (element) {
            if (!this.isSameElement(element)) {
                this.takeActiveElement(element);
                const delegate = sprites.resolve(element);
                if (delegate) {
                    switch (this.editMode) {
                        case 'points':
                            if (delegate.edit instanceof Function) {
                                const cancelFn = delegate.edit(element);
                                if (cancelFn instanceof Function) {
                                    this.takeCancelationFn(cancelFn);
                                }
                            }
                            break;
                        case 'box':
                            if (delegate.editBox instanceof Function) {
                                const cancelFn = delegate.editBox(element);
                                if (cancelFn instanceof Function) {
                                    this.takeCancelationFn(cancelFn);
                                }
                            }
                            break;
                    }
                }
            }
        } else {
            this.purge();
        }
    }

    isSameElement(element: SVGElement) {
        return element === this.innerElement && this.editMode === this.innerElementMode;
    }

    purge() {
        this.takeActiveElement(null);
        this.takeCancelationFn(() => void 0);
    }

    takeActiveElement(element: SVGElement | null) {
        this.innerElement = element;
        this.innerElementMode = this.editMode;
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
