import { connectEvent, ClientEvent } from "../../entities/client-event";

export class GroupControls {

    private el: HTMLElement;

    public readonly groupEvent = new ClientEvent<MouseEvent>();

    public readonly ungroupEvent = new ClientEvent<MouseEvent>();

    constructor() {
        this.el = document.createElement('div');
        const groupBtn = document.createElement('span');
        const ungroupBtn = document.createElement('span');
        this.el.appendChild(groupBtn);
        this.el.appendChild(ungroupBtn);
        groupBtn.innerText = `group`;
        ungroupBtn.innerText = `ungroup`;
        groupBtn.onclick = (event: MouseEvent) => this.fireGroupEvent(event);
        ungroupBtn.onclick = (event: MouseEvent) => this.fireUngroupEvent(event);
    }

    appendTo(parent: HTMLElement) {
        parent.appendChild(this.el);
    }

    @connectEvent('groupEvent')
    fireGroupEvent(event: MouseEvent) {
        return event;
    }

    @connectEvent('ungroupEvent')
    fireUngroupEvent(event: MouseEvent) {
        return event;
    }

}
