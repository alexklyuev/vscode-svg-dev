export class StateHistory {

    private history = Array<string>();
    private cursor = 0;
    
    constructor(
        private maxLength$: number,
    ) {}

    set maxLength(val: number) {
        this.maxLength$ = val;
        this.history.length = val;
    }

    pushState(state: string) {
        if (this.cursor > 0) {
            this.history.splice(0, this.cursor);
        }
        this.history.unshift(state);
        this.history.length = this.maxLength$;
        this.cursor = 0;
    }

    getUndoState() {
        const state = this.history[++this.cursor];
        if (state) {
            // this.cursor++;
            return state;
        }
        return null;
    }

    getRedoState() {
        if (this.cursor > 0) {
            this.cursor--;
            const state = this.history[this.cursor];
            if (state) {
                return state;
            }
        }
        return null;
    }

}
