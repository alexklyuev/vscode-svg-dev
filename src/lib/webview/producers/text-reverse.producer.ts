import { webviewEndpoint } from "&resolve/webview-endpoint";
import { textReversePipe } from "@/shared/pipes/text-reverse.pipe";


export const textReverseEndpoint = webviewEndpoint.createFromPipe(textReversePipe);
