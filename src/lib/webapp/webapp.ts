import { artboard } from "@/webview/services/artboard";
import { AppComponent } from "@/webapp/components/app.component";
import { guides } from "@/webview/services/guides";
import { artboardMove } from "@/webview/services/artboard-move";
import { findMethodIterator } from "@/common/iterators";
import { LayerComponent } from "@/webapp/components/layer.component";
import { zoom } from "@/webview/services/zoom";
// import { holder } from "@/webview/services/holder";


customElements.define('svgdev-app', AppComponent);
customElements.define('svgdev-layer', LayerComponent);

Object.assign(window, {
    svgdev: {
        artboard,
        zoom,
    },
});

window.addEventListener('DOMContentLoaded', init);

function init(this: void, _event: Event) {
    const app = new AppComponent();
    document.body.appendChild(app);

    // guides.createContainer();
    // artboardMove.initPosition();
    // guides.setContainerStyles();
    // artboardMove.on();

    (async () => {
        const artboardMoveMouseMove = findMethodIterator(artboardMove.onMouseMove);
        for await ( const _event of artboardMoveMouseMove ) {
            guides.setContainerStyles();
            // guides.setSelectionStyles(holder.elements);
        }
    })();

}

