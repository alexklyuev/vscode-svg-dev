import { HostApi } from "../host-api/host-api.interface";
import { Artboard } from "../../services/artboard/artboard";


export class FlushClient {

    constructor(
        private artboard: Artboard,
        private host: HostApi,
    ) {}

    listen() {
        window.addEventListener('message', (event: MessageEvent) => {
            if ('requestContent' in event.data) {
                const content = this.artboard.svg.outerHTML;
                this.host.api.postMessage({responseContent: content});
            }
        });
    }

}
