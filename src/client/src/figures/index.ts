import { artboardMove } from "@/webview/services/artboard-move";
import { artboard } from "@/webview/services/artboard";
import { userEventMan } from "@/webview/services/user-event";
import { appearance } from "@/webview/services/appearance";
import { spawner } from "@/dom/spawner/index";

import { FiguresCollection } from "./figures-collection";
import { CircleFigure } from "./circle.figure";
import { RectFigure } from "./rect.figure";
import { TextFigure } from "./text.figure";
import { zoom } from "../services/zoom";
import { GFigure } from "./g.figure";
import { EllipseFigure } from "./ellipse.figure";
import { LineFigure } from "./line.figure";
import { DraggerValue } from "../services/dragger/dragger-value";
import { DraggerDelegate } from "../services/dragger/dragger-delegate";
import { cancelListener } from "../listeners";
import { PolygonFigure } from "./polygon.figure";
import { DraggerPoints } from "../services/dragger/dragger-points";
import { PolylineFigure } from "./polyline.figure";
import { guides } from "../services/guides";
import { PathFigure } from "./path.figure";
import { DraggerPath } from "../services/dragger/dragger-path";
import { pathPoints } from "../services/path";
import { coordinator } from "../services/coordinator";
import { textReverseEndpoint } from "../producers/text-reverse.producer";
import { MoverPath } from "../services/mover/mover-path";
import { MoverPoints } from "../services/mover/mover-points";
import { MoverValue } from "../services/mover/mover-value";
import { MoverDelegate } from "../services/mover/mover-delegate";
import { hints } from "../services/hints";
import { rectPointsEditor } from "../points-editor";


const figuresCollection = new FiguresCollection();

const draggerLeftTop = new DraggerValue(['x'], ['y'], zoom);
const draggerCenter = new DraggerValue(['cx'], ['cy'], zoom);
const draggerDouble = new DraggerValue(['x1', 'x2'], ['y1', 'y2'], zoom);
const draggerPoints = new DraggerPoints(zoom);
const draggerDelegate = new DraggerDelegate(figuresCollection);
const draggerPath = new DraggerPath(zoom, pathPoints);


const moverPath = new MoverPath(pathPoints);
const moverPoints = new MoverPoints();
const moverLeftTop = new MoverValue(['x'], ['y']);
const moverCenter = new MoverValue(['cx'], ['cy']);
const moverLine = new MoverValue(['x1', 'x2'], ['y1', 'y2']);
const moverDelegate = new MoverDelegate(figuresCollection);


export const pathFigure = new PathFigure(
    draggerPath,
    moverPath,
    artboard,
    artboardMove,
    zoom,
    cancelListener,
    userEventMan,
    guides,
    pathPoints,
    coordinator,
    appearance,
    hints,
);

figuresCollection.add(
    new CircleFigure(
        draggerCenter,
        moverCenter,
        userEventMan,
        zoom,
        coordinator,
        cancelListener,
        guides,
        appearance,
        hints,
        spawner,
    ),
    new EllipseFigure(
        draggerCenter,
        moverCenter,
        zoom,
        cancelListener,
        userEventMan,
        guides,
        coordinator,
        appearance,
        hints,
        spawner,
    ),
    new RectFigure(
        draggerLeftTop, 
        moverLeftTop,
        userEventMan,
        zoom,
        guides,
        coordinator,
        cancelListener,
        appearance,
        spawner,
        rectPointsEditor,
    ),
    new TextFigure(
        draggerLeftTop,
        moverLeftTop,
        appearance,
        textReverseEndpoint,
    ),
    new GFigure(
        draggerDelegate,
        moverDelegate,
    ),
    new LineFigure(
        draggerDouble,
        moverLine,
        zoom,
        cancelListener,
        userEventMan,
        coordinator,
        guides,
        appearance,
        hints,
    ),
    new PolygonFigure(
        draggerPoints,
        moverPoints,
        zoom,
        cancelListener,
        userEventMan,
        guides,
        appearance,
        hints,
    ),
    new PolylineFigure(
        draggerPoints,
        moverPoints,
        zoom,
        cancelListener,
        userEventMan,
        guides,
        appearance,
        hints,
    ),
    pathFigure,
);

export { figuresCollection };
