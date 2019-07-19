import { webviewEndpoint } from "../services/endpoint";
import { artboardStyleInversePipe } from "../../../shared/pipes/artboard-style.pipe";

export const artboardStyleInverseProducer = webviewEndpoint.createFromPipe(artboardStyleInversePipe);
