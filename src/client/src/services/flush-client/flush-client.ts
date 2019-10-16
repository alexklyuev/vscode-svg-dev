
import { vscodeHost } from "@/webview/services/host-api";
import { artboard } from "@/webview/services/artboard";



export class FlushClient {

    listen() {
        /**
         * @deprecated not used, pipe listener used instead
         */
        window.addEventListener('message', (event: MessageEvent) => {
            if ('requestContent' in event.data) {
                console.log('requiest content message received');
                const content = artboard.svg.outerHTML;
                vscodeHost.api.postMessage({responseContent: content});
            }
        });
    }

}
