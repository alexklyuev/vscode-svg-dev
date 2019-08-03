import { CancelListener } from "../../listeners/cancel.listener";

export class CancelHub {

    private cancelFn: (() => void) | null = null;

    constructor(
        private cancelListner: CancelListener,
    ) {}

    add(fn: () => void) {
        if (this.cancelFn instanceof Function) {
            this.cancelListner.keyEvent.off(this.cancelFn);
            this.cancelFn();
        }
        this.cancelFn = fn;
        this.cancelListner.keyEvent.on(this.cancelFn);
    }

}
