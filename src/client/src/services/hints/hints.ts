import { makeMethodIterator } from "@/common/iterators";

// import { EventBus, connectEvent } from "../../../../lib/common/events";
import { HintsDict } from "../../../../shared/hints/hints.dict";


export class Hints {

    // public readonly hintEvent = new EventBus<keyof HintsDict>();

    setHint(hintKey: keyof HintsDict) {
        this.fireHintEvent(hintKey);
    }

    // @connectEvent('hintEvent')
    @makeMethodIterator()
    fireHintEvent(hintKey: keyof HintsDict) {
        return hintKey;
    }

}
