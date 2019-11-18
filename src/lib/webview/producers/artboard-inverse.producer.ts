import { webviewEndpoint } from "&resolve/webview-endpoint";

import { artboardInversePipe } from "../../shared/pipes/artboard.pipe";


export const artboardInverseEndpoint = webviewEndpoint.createFromPipe(artboardInversePipe);
