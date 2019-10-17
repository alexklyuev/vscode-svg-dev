import { RectPointsEditor } from "@/webview/points-editor/rect.points-editor";
import { CirclePointsEditor } from "@/webview/points-editor/circle.points-editor";
import { EllipsePointsEditor } from "./ellipse.points-editor";

export const rectPointsEditor = new RectPointsEditor();
export const circlePointsEditor = new CirclePointsEditor();
export const ellipsePointsEdtitor = new EllipsePointsEditor();
