import { editProducer } from "@/webapp/producers";
import { EditMode } from "@/shared/pipes/edit-mode.pipe";


export class EditComponent extends HTMLElement {

    private template = `
        <button type=button data-mode=points>edit points
        <button type=button data-mode=box>edit box
    `;

    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = this.template;
        shadow.addEventListener('click', event => {
            const { target } = event;
            if (target instanceof HTMLButtonElement) {
                const mode = target.getAttribute('data-mode');
                if (mode) {
                    editProducer.makeSetRequest({ mode: mode as EditMode });
                }
            }
        });
    }

}
