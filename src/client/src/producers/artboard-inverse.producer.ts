import { webviewEndpoint } from "../services/endpoint";
import { artboardInversePipe } from "../../../shared/pipes/artboard.pipe";

export const artboardInverseEndpoint = webviewEndpoint.createFromPipe(artboardInversePipe);
