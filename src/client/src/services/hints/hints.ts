import { ClientEvent, connectEvent } from "../../entities/client-event";
import { HintsDict } from "../../../../shared/hints/hints.dict";

export class Hints {

    public readonly hintEvent = new ClientEvent<keyof HintsDict>();

    setHint(hintKey: keyof HintsDict) {
        this.fireHintEvent(hintKey);
    }

    @connectEvent('hintEvent')
    fireHintEvent(hintKey: keyof HintsDict) {
        return hintKey;
    }

}
