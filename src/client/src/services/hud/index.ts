import { Hud } from "./hud";
import { appearance } from "../appearance";
import { appearanceEndpoint } from "../../producers/appearance.producer";

export const hud = new Hud(
  appearance,
  appearanceEndpoint,
);
