import { CancelListener } from "./cancel.listener";
import { webviewEndpoint } from "../services/endpoint";
import { cancelPipe } from "../../../shared/pipes/cancel.pipe";
import { ArtboardListener } from "./artboard.listener";
import { artboardPipe } from "../../../shared/pipes/artboard.pipe";
import { artboard } from "../services/artboard";

export const cancelListener = new CancelListener(webviewEndpoint, cancelPipe);

export const artboardListener = new ArtboardListener(webviewEndpoint, artboardPipe, artboard);

