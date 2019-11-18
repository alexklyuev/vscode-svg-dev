import { app, zoom, artboard, artboardMove, guides } from "@/web/init";
import { ZoomCommandsComponent } from "@/web/components/zoom-commands.component";
import { CreateCommandsComponent } from  "@/web/components/create-commands.component";
import { ToolbarComponent } from "@/web/components/toolbar.component";
import { addBasicSprites } from '@/webview/sprites';
import { sprites } from "@/webview/services/sprites";
import { picker } from '@/webview/services/picker';
import { toClient, toHost } from "@/webapp/event-emitter";
import { activateAllListeners } from "@/webview/listeners";
import { editHub } from "@/webview/services/edit-hub";
import { appearance } from "@/webview/services/appearance";


addBasicSprites(sprites);

picker.on();

activateAllListeners();

customElements.define('svgdev-zoom-command', ZoomCommandsComponent);
customElements.define('svgdev-create-commands', CreateCommandsComponent);
customElements.define('svgdev-toolbar', ToolbarComponent);

Object.assign(window, {
    svgdev: {
        zoom,
        artboard,
        artboardMove,
        appearance,
        guides,
        editHub,
        events: {
            toClient,
            toHost,
        }
    },
});

window.addEventListener('load', onLoad);

function onLoad(this: void, _event: Event) {
    document.body.appendChild(app);
    document.body.appendChild(new ToolbarComponent());
}
