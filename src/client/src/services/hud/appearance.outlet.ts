import { ArtboardControls } from "./artboard.controls";

export class AppearanceOutlet {

    private aprOutlet: HTMLElement;

    constructor(
        private artboardControls: ArtboardControls,
    ) {
        this.aprOutlet = document.createElement('div');
        Object.assign(this.aprOutlet.style, {
            'margin-top': '10px',
            'margin-left': '10px',
        });
        this.artboardControls.appendTo(this.aprOutlet);
    }

    appendTo(parentElement: HTMLElement) {
        parentElement.appendChild(this.aprOutlet);
    }

}
