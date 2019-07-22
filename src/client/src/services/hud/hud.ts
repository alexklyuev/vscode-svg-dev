import { AppearanceOutlet } from "./appearance.outlet";
import { HintsOutlet } from "./hints.outlet";


export class Hud {

    private element: HTMLElement;

    constructor(
        public readonly appearanceOutlet: AppearanceOutlet,
        public readonly hintOutlet: HintsOutlet,
    ) {
        this.element = document.querySelector<HTMLElement>('#hud')!;
        Object.assign(this.element.style, {
            position: 'fixed',
            left: '0',
            top: '0',
        });
        this.appearanceOutlet.appendTo(this.element);
        this.hintOutlet.appendTo(this.element);
    }

}
