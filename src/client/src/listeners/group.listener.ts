import { PipeEndpoint, Pipe } from "@/common/pipe/pipe";
import { webviewEndpoint } from "@/webview/services/webview-endpoint";

import { ElementHolder } from "../services/picker/element-holder";
import { setState } from "../decorators/set-state.decorator";
import { Artboard } from "../services/artboard/artboard";


export class GroupListener {

    private groupClient: PipeEndpoint<'group' | 'ungroup', {}, 'group'>;

    constructor(
        private groupPipe: Pipe<'group' | 'ungroup', {}, 'group'>,
        private holder: ElementHolder,
        private artboard: Artboard,
    ) {
        this.groupClient = webviewEndpoint.createFromPipe(this.groupPipe);
    }

    listen() {
        this.groupClient.listenSetRequest(
            _reguest => this.holder.elements.length > 0,
            (command, _true) => {
                this.processCommand(command);
            },
        );
    }

    /**
     * 
     */
    processCommand(command: 'group' | 'ungroup') {
        switch (command) {
            case 'group': this.group(); break;
            case 'ungroup': this.ungroup(); break;
        }
    }

    /**
     * 
     */
    @setState
    group() {
        const tempAttr = 'data-svg-dev-temp-sort';
        this.holder.elements.forEach(el => el.setAttribute(tempAttr, '1'));
        const els = Array.from(document.querySelectorAll(`[${ tempAttr }]`));
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.artboard.svg.appendChild(g);
        els.forEach(el => g.appendChild(el));
        els.forEach(el => el.removeAttribute(tempAttr));
        this.holder.elements = [g];
    }

    /**
     * 
     */
    @setState
    ungroup() {
        this.holder.elements
        .filter(el => el instanceof SVGGElement)
        .forEach(g => {
            const parent = g.parentElement!;
            const children = Array.from(g.children) as SVGElement[];
            children.forEach(child => {
                parent.appendChild(child);
            });
            parent.removeChild(g);
            this.holder.elements = children;
        });
    }

}
