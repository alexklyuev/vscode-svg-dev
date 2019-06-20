import { FiguresCollection } from "./figures-collection";
import { CircleFigure } from "./circle.figure";
import { RectFigure } from "./rect.figure";
import { TextFigure } from "./text.figure";
import { artboard, artboardMove } from "../services/artboard";
import { zoom } from "../services/zoom";
import { GFigure } from "./g.figure";
import { EllipseFigure } from "./ellipse.figure";
import { LineFigure } from "./line.figure";
import { DraggerValue } from "../services/dragger/dragger-value";
import { DraggerDelegate } from "../services/dragger/dragger-delegate";
import { cancelListener } from "../listeners";
import { userEventMan } from "../services/user-event";
import { PolygonFigure } from "./polygon.figure";
import { DraggerPoints } from "../services/dragger/dragger-points";
import { PolylineFigure } from "./polyline.figure";
import { guides } from "../services/guides";
import { PathFigure } from "./path.figure";
import { DraggerPath } from "../services/dragger/dragger-path";
import { pathPoints } from "../services/path";


const figuresCollection = new FiguresCollection();

const draggerLeftTop = new DraggerValue(['x'], ['y'], zoom);
const draggerCenter = new DraggerValue(['cx'], ['cy'], zoom);
const draggerDouble = new DraggerValue(['x1', 'x2'], ['y1', 'y2'], zoom);
const draggerPoints = new DraggerPoints(zoom);
const draggerDelegate = new DraggerDelegate(figuresCollection);
const draggerPath = new DraggerPath(zoom, pathPoints);


figuresCollection.add(
    new CircleFigure(draggerCenter, artboard),
    new EllipseFigure(draggerCenter, artboard, artboardMove, zoom, cancelListener, userEventMan, guides),
    new RectFigure(draggerLeftTop, artboard),
    new TextFigure(draggerLeftTop, artboard),
    new GFigure(draggerDelegate, artboard),
    new LineFigure(draggerDouble, artboard, zoom, cancelListener, userEventMan),
    new PolygonFigure(draggerPoints, artboard, zoom, cancelListener, userEventMan),
    new PolylineFigure(draggerPoints, artboard, zoom, cancelListener, userEventMan),
    new PathFigure(draggerPath, artboard, artboardMove, zoom, cancelListener, userEventMan, guides, pathPoints),
);

export { figuresCollection };
