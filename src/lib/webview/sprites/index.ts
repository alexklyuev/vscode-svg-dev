import { CircleSprite } from "@/webview/sprites/circle.sprite";
import { RectSprite } from "@/webview/sprites/rect.sprite";
import { TextSprite } from "@/webview/sprites/text.sprite";
import { GSprite } from "@/webview/sprites/g.sprite";
import { EllipseSprite } from "@/webview/sprites/ellipse.sprite";
import { LineSprite } from "@/webview/sprites/line.sprite";
import { PolygonSprite } from "@/webview/sprites/polygon.sprite";
import { PolylineSprite } from "@/webview/sprites/polyline.sprite";
import { PathSprite } from "@/webview/sprites/path.sprite";
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
