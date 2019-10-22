import { webviewEndpoint } from "@/webview/services/webview-endpoint";

import { infomessagePipe } from "../../shared/pipes/infomessage.pipe";


export const infomessageEndpoint = webviewEndpoint.createFromPipe(infomessagePipe);
