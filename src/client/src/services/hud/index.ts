import { Hud } from "./hud";
import { ColorRepresenterService } from "./color-representer.service";
import { appearance } from "../appearance";
import { appearanceEndpoint } from "../../producers/appearance.producer";
import { artboard } from "../artboard";
import { artboardListener, artboardStyleListener } from "../../listeners";
import { artboardInverseEndpoint } from "../../producers/artboard-inverse.producer";
import { artboardStyleInverseProducer } from "../../producers/artboard-style-inverse.producer";

export const colorRepresenter = new ColorRepresenterService();

export const hud = new Hud(
  appearance,
  appearanceEndpoint,
  artboard,
  artboardListener,
  artboardInverseEndpoint,
  artboardStyleListener,
  artboardStyleInverseProducer,
);
