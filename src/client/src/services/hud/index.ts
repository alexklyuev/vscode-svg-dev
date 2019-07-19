import { Hud } from "./hud";
import { appearance } from "../appearance";
import { appearanceEndpoint } from "../../producers/appearance.producer";
import { artboard } from "../artboard";
import { artboardListener } from "../../listeners";
import { artboardInverseEndpoint } from "../../producers/artboard-inverse.producer";

export const hud = new Hud(
  appearance,
  appearanceEndpoint,
  artboard,
  artboardListener,
  artboardInverseEndpoint,
);
