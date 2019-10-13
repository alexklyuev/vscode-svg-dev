import { CancelListener } from "../../listeners/cancel.listener";
import { findIterator } from "../../../../lib/common/iterators";

export class EditPointsHub {

    private cancelFn: (() => void) | null = null;

    constructor(
        private cancelListner: CancelListener,
    ) {}

    take(fn: () => void) {
        const cancelEvents = findIterator(this.cancelListner.eventReceived);
        if (this.cancelFn instanceof Function) {
            // this.cancelListner.keyEvent.off(this.cancelFn);
            cancelEvents.return! ();
            this.cancelFn();
        }
        this.cancelFn = fn;
        // this.cancelListner.keyEvent.on(this.cancelFn);
        (async () => {
            for await (const _event of cancelEvents) {
                if (this.cancelFn instanceof Function) {
                    this.cancelFn();
                }
            }
        })();
    }

}
