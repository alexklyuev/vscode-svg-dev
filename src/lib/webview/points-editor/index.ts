import { RectPointsEditor } from "@/webview/points-editor/rect.points-editor";
import { CirclePointsEditor } from "@/webview/points-editor/circle.points-editor";
import { EllipsePointsEditor } from "@/webview/points-editor/ellipse.points-editor";
import { LinePointsEditor } from "@/webview/points-editor/line.points-editor";
import { PolyPointsEditor } from "@/webview/points-editor/poly.points-editor";
import { PathPointsEditor } from "@/webview/points-editor/path.points-editor";


export const rectPointsEditor = new RectPointsEditor();
export const circlePointsEditor = new CirclePointsEditor();
export const ellipsePointsEdtitor = new EllipsePointsEditor();
export const linePointsEditor = new LinePointsEditor();
export const polyPointsEditor = new PolyPointsEditor();
export const pathPointsEditor = new PathPointsEditor();
