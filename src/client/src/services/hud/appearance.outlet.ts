import { Outlet } from './models/outlet.model';


export class AppearanceOutlet implements Outlet {

    private aprOutletEl: HTMLElement;

    constructor(
        ...children: Outlet[]
    ) {
        this.aprOutletEl = document.createElement('div');
        Object.assign(this.aprOutletEl.style, {
            'margin-top': '5px',
            'margin-left': '10px',
        });
        children.forEach(child => child.appendTo(this.aprOutletEl));
    }

    appendTo(parentElement: HTMLElement) {
        parentElement.appendChild(this.aprOutletEl);
    }

}
