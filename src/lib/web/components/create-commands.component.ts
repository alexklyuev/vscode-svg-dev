import { sprites } from "@/webview/services/sprites";


export class CreateCommandsComponent extends HTMLElement {

    private template = `
        <button type=button data-name=circle>circle
        <button type=button data-name=rect>rect
        <button type=button data-name=line>line
        <button type=button data-name=path>path
        <button type=button data-name=polygon>polygon
        <button type=button data-name=polyline>polyline
        <button type=button data-name=text>text
    `;
    
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = this.template;
        shadow.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            const { target } = event;
            if (target instanceof HTMLButtonElement) {
                const name = target.getAttribute('data-name');
                if (name) {
                    console.log(name);
                    const sprite = sprites.resolve(name);
                    if (sprite) {
                        const { createOperator } = sprite.operators;
                        if (createOperator) {
                            createOperator.create(name, {});
                        } else {
                            console.log('no operator');
                        }
                    } else {
                        console.log('no sprite');
                    }
                }
            }
        });
    }

}
