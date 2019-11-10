import { artboard } from "@/webview/services/artboard";
import { guides } from "@/webview/services/guides";
import { artboardMove } from "@/webview/services/artboard-move";
import { zoom } from "@/webview/services/zoom";
import { LayerComponent } from "./layer.component";


export class AppComponent extends HTMLElement {

//     private template = `
// <div id="main">
//     <div id="artboard">
//         <svg width="300px" height="400px" viewBox="0 0 300 400" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
//         </svg>
//     </div>
//     <div id="tools">
//     </div>
//     <div id="hud">
//     </div>
// </div>
//     `;

    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        artboard.setSelectionHost(shadow);
        // shadow.innerHTML = this.template;
        // console.log('SvgdevApp component constructed');
        const div = document.createElement('div');
        shadow.appendChild(div);
        const workarea = new LayerComponent();
        const tools = new LayerComponent();
        div.appendChild(workarea);
        div.appendChild(tools);

        workarea.id = 'workareaLayer';
        tools.id = 'toolsLayer';

        artboard.getBoxFn = () => workarea.div;
        artboard.getSvgFn = () => workarea.svg;
        artboard.getToolsFn = () => tools.div;
        artboard.clearCache();

        guides.setContainer(tools.svg);
        // guides.setContainerStyles();

        artboardMove.target = workarea.div;
        artboardMove.initPosition();
        artboardMove.on();

        zoom.target = workarea.div;

        setTimeout(() => {
            Object.assign(artboard.box.style, {
                position: 'absolute',
            });
            Object.assign(artboard.svg, {
                position: 'relative',
                top: '0px',
                left: '0px',
            });
            guides.setContainerStyles();
        }, 0);

    }

}
