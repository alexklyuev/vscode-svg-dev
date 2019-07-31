export class History {

    private history = Array<string>();
    private cursor = 0;
    private maxLength$ = 10;

    set maxLength(val: number) {
        console.log('set history max length', val);
        this.maxLength$ = val;
        this.history.length = val;
    }

    pushState(state: string) {
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
