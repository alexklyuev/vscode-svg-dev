import { webviewEndpoint } from "../services/endpoint";
import { inverseInteractivePipe } from "../../../shared/pipes/inverse-interactive.pipe";


export const inverseInteractiveEndpoint = webviewEndpoint.createFromPipe(inverseInteractivePipe);