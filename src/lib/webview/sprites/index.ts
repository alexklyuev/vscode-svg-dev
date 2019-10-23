import { CircleFigure } from "@/webview/sprites/circle.figure";
import { RectFigure } from "@/webview/sprites/rect.figure";
import { TextFigure } from "@/webview/sprites/text.figure";
import { GFigure } from "@/webview/sprites/g.figure";
import { EllipseFigure } from "@/webview/sprites/ellipse.figure";
import { LineFigure } from "@/webview/sprites/line.figure";
import { PolygonFigure } from "@/webview/sprites/polygon.figure";
import { PolylineFigure } from "@/webview/sprites/polyline.figure";
import { PathFigure } from "@/webview/sprites/path.figure";
import { sprites } from "@/webview/services/sprites";


export const circleFigure = new CircleFigure();
export const ellipseFigure = new EllipseFigure();
export const rectFigure = new RectFigure();
export const textFigure = new TextFigure();
export const gFigure = new GFigure();
export const lineFigure = new LineFigure();
export const polygonFigure = new PolygonFigure();
export const polylineFigure = new PolylineFigure();
export const pathFigure = new PathFigure();

sprites.add(
    circleFigure,
    ellipseFigure,
    rectFigure,
    textFigure,
    gFigure,
    lineFigure,
    polygonFigure,
    polylineFigure,
    pathFigure,
);
