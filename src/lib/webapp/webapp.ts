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
import { hostEndpoint } from "@/webapp/host-endpoint";
import { webviewEndpoint } from "&resolve/webview-endpoint";
import { editPipe } from "@/shared/pipes/edit.pipe";
import { activateKeyboardShortcuts } from "@/webapp/keyboard";
import { producers } from "@/webapp/producers";
import { EditComponent } from "@/web/components/edit.component";


addBasicSprites(sprites);

picker.on();

activateAllListeners();

activateKeyboardShortcuts();

customElements.define('svgdev-zoom-command', ZoomCommandsComponent);
customElements.define('svgdev-create-commands', CreateCommandsComponent);
customElements.define('svgdev-edit', EditComponent);
customElements.define('svgdev-toolbar', ToolbarComponent);

Object.assign(window, {
    svgdev: {
        zoom,
        artboard,
        artboardMove,
        appearance,
        guides,
        editHub,
        producers,
        events: {
            toClient,
            toHost,
        },
        endpoints: {
            host: hostEndpoint,
            client: webviewEndpoint,
        },
        pipes: {
            editPipe,
        }
    },
});

window.addEventListener('load', onLoad);

function onLoad(this: void, _event: Event) {
    document.body.appendChild(app);
    document.body.appendChild(new ToolbarComponent());
}
