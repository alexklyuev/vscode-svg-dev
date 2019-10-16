
import { host } from "@/webview/services/host-api";

import { Artboard } from "../../services/artboard/artboard";


export class FlushClient {

    constructor(
        private artboard: Artboard,
    ) {}

    listen() {
        /**
         * wtf? is it working code?
         * @todo rewrite to pipes abstraction
         */
        window.addEventListener('message', (event: MessageEvent) => {
            if ('requestContent' in event.data) {
                console.log('requiest content message received');
                const content = this.artboard.svg.outerHTML;
                host.api.postMessage({responseContent: content});
            }
        });
    }

}
