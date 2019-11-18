import { zoom } from "@/web/init";
import { findMethodIterator } from "@/common/iterators";


export class ZoomCommandsComponent extends HTMLElement {

    private template = `
        <span>
            zoom: 
            <span>100</span>
            %
        </span>
        <button type=button>zoom in
        <button type=button>zoom out
        <button type=button>zoom 1:1
    `;

    constructor() {
        super();

        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = this.template;
        const buttons = shadow.querySelectorAll('button');
        const [zoomIn, zoomOut, zoom100 ] = Array.from(buttons);
        zoomIn.onclick = _event => zoom.update({delta: .1});
        zoomOut.onclick = _event => zoom.update({delta: -.1});
        zoom100.onclick = _event => zoom.update({abs: 1});
        const spans = shadow.querySelectorAll('span');
        const zoomValueNode = spans[1] ! ;
        (async () => {
            for await (const value of findMethodIterator(zoom.update)) {
                zoomValueNode.innerText = `${ Math.round(value * 100) }`;
            }
        })();
    }

}
