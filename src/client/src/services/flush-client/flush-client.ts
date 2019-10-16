import { HostApi } from "@/webview/services/host-api/host-api.interface";

import { Artboard } from "../../services/artboard/artboard";


export class FlushClient {

    constructor(
        private artboard: Artboard,
        private host: HostApi,
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
                this.host.api.postMessage({responseContent: content});
            }
        });
    }

}
