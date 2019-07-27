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
        groupBtn.onclick = (event: MouseEvent) => {
            this.fireGroupEvent(event);
            Object.assign(groupBtn.style, {
                color: '#999',
            });
            setTimeout(() => {
                Object.assign(groupBtn.style, {
                    color: '#eee',
                });
            }, 150);
        };
        ungroupBtn.onclick = (event: MouseEvent) => {
            this.fireUngroupEvent(event);
            Object.assign(ungroupBtn.style, {
                color: '#999',
            });
            setTimeout(() => {
                Object.assign(ungroupBtn.style, {
                    color: '#eee',
                });
            }, 150);
        };
        Object.assign(this.el.style, {
            display: 'inline-block',
            padding: '3px 3px',
            margin: '2px 2px 2px 5px',
            border: '1px solid rgba(255,255,255,.1)',
            borderRadius: '3px',
            background: 'rgba(42,42,42,.7)',
            color: '#eee',
            fontSize: '10px',
            userSelect: 'none',
        });
        Object.assign(groupBtn.style, {
            display: 'inline-block',
            cursor: 'pointer',
            paddingRight: '3px',
            borderRight: '1px solid rgba(255,255,255,.1)'
        });
        Object.assign(ungroupBtn.style, {
            display: 'inline-block',
            cursor: 'pointer',
            paddingLeft: '4px',
        });
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
