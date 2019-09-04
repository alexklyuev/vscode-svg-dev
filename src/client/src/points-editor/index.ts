import { RectPointsEditor } from "./rect.points-editor";
import { spawn } from "@/dom/spawner";
import { hints } from "../services/hints";
import { zoom } from "../services/zoom";
import { appearance } from "../services/appearance";
import { guides } from "../services/guides";

export const rectPointsEditor = new RectPointsEditor(
    hints,
    zoom,
    appearance,
    spawn,
    guides,
);
