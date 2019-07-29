import { AppearanceOutlet } from "./appearance.outlet";


export class Hud {

    private element: HTMLElement;

    constructor(
        public readonly appearanceOutlet: AppearanceOutlet,
    ) {
        this.element = document.querySelector<HTMLElement>('#hud')!;
        Object.assign(this.element.style, {
            position: 'fixed',
            left: '0',
            top: '0',
        });
        this.appearanceOutlet.appendTo(this.element);
    }

}
