import { CancelListener } from "./cancel.listener";
import { webviewEndpoint } from "../services/endpoint";
import { cancelPipe } from "../../../shared/pipes/cancel.pipe";

export const cancelListener = new CancelListener(webviewEndpoint, cancelPipe);
