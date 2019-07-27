import { PipeEndpoint, Pipe } from "../../../shared/services/pipe/pipe";
import { WebviewEndpoint } from "../services/endpoint/webview-endpoint";
import { ElementHolder } from "../services/picker/element-holder";
import { setState } from "../decorators/set-state.decorator";
import { Artboard } from "../services/artboard/artboard";


export class GroupListener {

    private groupClient: PipeEndpoint<'group' | 'ungroup', {}, 'group'>;

    constructor(
        private webviewEndpoinnt: WebviewEndpoint,
        private groupPipe: Pipe<'group' | 'ungroup', {}, 'group'>,
        private holder: ElementHolder,
        private artboard: Artboard,
    ) {
        this.groupClient = this.webviewEndpoinnt.createFromPipe(this.groupPipe);
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
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.artboard.svg.appendChild(g);
        this.holder.elements.forEach(el => g.appendChild(el));
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
