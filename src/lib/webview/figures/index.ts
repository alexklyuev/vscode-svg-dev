import { CircleFigure } from "@/webview/figures/circle.figure";
import { RectFigure } from "@/webview/figures/rect.figure";
import { TextFigure } from "@/webview/figures/text.figure";
import { GFigure } from "@/webview/figures/g.figure";
import { EllipseFigure } from "@/webview/figures/ellipse.figure";
import { LineFigure } from "@/webview/figures/line.figure";
import { PolygonFigure } from "@/webview/figures/polygon.figure";
import { PolylineFigure } from "@/webview/figures/polyline.figure";
import { PathFigure } from "@/webview/figures/path.figure";
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
