import { webviewEndpoint } from "&resolve/webview-endpoint";

import { appearancePipe } from "../../shared/pipes/appearance.pipe";


export const appearanceEndpoint = webviewEndpoint.createFromPipe(appearancePipe);
