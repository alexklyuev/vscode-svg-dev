import { CancelListener } from "./cancel.listener";
import { webviewEndpoint } from "../services/endpoint";
import { cancelPipe } from "../../../shared/pipes/cancel.pipe";
import { ArtboardListener } from "./artboard.listener";
import { artboardPipe } from "../../../shared/pipes/artboard.pipe";
import { artboard } from "../services/artboard";
import { ArtboardStyleListener } from "./artboard-style.listener";
import { artboardStylePipe } from "../../../shared/pipes/artboard-style.pipe";
import { CssJsNotationConverter } from "../../../shared/services/css/css-js-notation-converter";

export const cancelListener = new CancelListener(webviewEndpoint, cancelPipe);

export const artboardListener = new ArtboardListener(webviewEndpoint, artboardPipe, artboard);

export const artboardStyleListener = new ArtboardStyleListener(webviewEndpoint, artboardStylePipe, artboard, new CssJsNotationConverter());

