import { webviewEndpoint } from "../services/endpoint";
import { infomessagePipe } from "../../../shared/pipes/infomessage.pipe";

export const infomessageEndpoint = webviewEndpoint.createFromPipe(infomessagePipe);
