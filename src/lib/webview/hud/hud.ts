import { Outlet } from "./models/outlet.model";


export class Hud {

    private element: HTMLElement;

    constructor(
        ...children: Outlet[]
    ) {
        this.element = document.querySelector<HTMLElement>('#hud')!;
        Object.assign(this.element.style, {
            position: 'fixed',
            left: '0',
            top: '0',
        });
        children.forEach(child => child.appendTo(this.element));
    }

}
