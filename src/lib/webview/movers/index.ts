import { MoverDelegate } from "./mover-delegate";
import { MoverPath } from "./mover-path";
import { MoverPoints } from "./mover-points";
import { MoverValue } from "./mover-value";

export const moverPath = new MoverPath();
export const moverPoints = new MoverPoints();
export const moverLeftTop = new MoverValue(['x'], ['y']);
export const moverCenter = new MoverValue(['cx'], ['cy']);
export const moverLine = new MoverValue(['x1', 'x2'], ['y1', 'y2']);
export const moverDelegate = new MoverDelegate();