import { webviewEndpoint } from "&resolve/webview-endpoint";

import { historyPipe } from "../../shared/pipes/history.pipe";


export const historyProducer = webviewEndpoint.createFromPipe(historyPipe);
