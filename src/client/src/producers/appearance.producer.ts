import { appearancePipe } from "../../../shared/pipes/appearance.pipe";
import { webviewEndpoint } from "../services/endpoint";


export const appearanceEndpoint = webviewEndpoint.createFromPipe(appearancePipe);
