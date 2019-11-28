import { app, zoom, artboard, artboardMove, guides } from "@/web/init";
import { ZoomCommandsComponent } from "@/web/components/zoom-commands.component";
import { CreateCommandsComponent } from  "@/web/components/create-commands.component";
import { ToolbarComponent } from "@/web/components/toolbar.component";
import { addBasicSprites } from '@/webview/sprites';
import { sprites } from "@/webview/services/sprites";
import { picker } from '@/webview/services/picker';
import { holder } from "@/webview/services/holder";
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


/**
 * initialize stuff
 */
addBasicSprites(sprites);
picker.on();
activateAllListeners();
activateKeyboardShortcuts();

/**
 * register components
 */
customElements.define('svgdev-zoom-command', ZoomCommandsComponent);
customElements.define('svgdev-create-commands', CreateCommandsComponent);
customElements.define('svgdev-edit', EditComponent);
customElements.define('svgdev-toolbar', ToolbarComponent);

/**
 * console interface
 */
Object.assign(window, {
    svgdev: {
        zoom,
        artboard,
        artboardMove,
        appearance,
        guides,
        editHub,
        producers,
        picker,
        holder,
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

window.addEventListener('load', _event => {
    document.body.appendChild(app);
    const toolbar = new ToolbarComponent();
    document.body.appendChild(toolbar);
});
