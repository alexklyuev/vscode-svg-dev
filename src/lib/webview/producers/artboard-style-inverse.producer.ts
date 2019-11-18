import { webviewEndpoint } from "&resolve/webview-endpoint";

import { artboardStyleInversePipe } from "../../shared/pipes/artboard-style.pipe";


export const artboardStyleInverseProducer = webviewEndpoint.createFromPipe(artboardStyleInversePipe);
