import { CircleSprite } from "@/webview/sprites/circle.figure";
import { RectSprite } from "@/webview/sprites/rect.figure";
import { TextSprite } from "@/webview/sprites/text.figure";
import { GSprite } from "@/webview/sprites/g.figure";
import { EllipseSprite } from "@/webview/sprites/ellipse.figure";
import { LineSprite } from "@/webview/sprites/line.figure";
import { PolygonSprite } from "@/webview/sprites/polygon.figure";
import { PolylineSprite } from "@/webview/sprites/polyline.figure";
import { PathSprite } from "@/webview/sprites/path.figure";
import { sprites } from "@/webview/services/sprites";


export const circleSprite = new CircleSprite();
export const ellipseSprite = new EllipseSprite();
export const rectSprite = new RectSprite();
export const textSprite = new TextSprite();
export const gSprite = new GSprite();
export const lineSprite = new LineSprite();
export const polygonSprite = new PolygonSprite();
export const polylineSprite = new PolylineSprite();
export const pathSprite = new PathSprite();

sprites.add(
    circleSprite,
    ellipseSprite,
    rectSprite,
    textSprite,
    gSprite,
    lineSprite,
    polygonSprite,
    polylineSprite,
    pathSprite,
);
