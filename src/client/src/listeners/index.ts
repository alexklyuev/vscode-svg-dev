import { CancelListener } from "./cancel.listener";
import { cancelPipe } from "../../../shared/pipes/cancel.pipe";
import { ArtboardListener } from "./artboard.listener";
import { artboardPipe } from "../../../shared/pipes/artboard.pipe";
import { artboard } from "../services/artboard";
import { ArtboardStyleListener } from "./artboard-style.listener";
import { artboardStylePipe } from "../../../shared/pipes/artboard-style.pipe";
import { CssJsNotationConverter } from "../../../shared/services/css/css-js-notation-converter";

export const cancelListener = new CancelListener(cancelPipe);

export const artboardListener = new ArtboardListener(artboardPipe, artboard);

export const artboardStyleListener = new ArtboardStyleListener(artboardStylePipe, artboard, new CssJsNotationConverter());

