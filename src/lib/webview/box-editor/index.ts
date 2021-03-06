import { EllipseBoxEditor } from "@/webview/box-editor/ellipse.box-editor";
import { RectBoxEditor } from "@/webview/box-editor/rect.box-editor";
import { PolyBoxEditor } from "@/webview/box-editor/poly.box-editor";
import { LineBoxEditor } from "@/webview/box-editor/line.box-editor";
import { CircleBoxEditor } from "@/webview/box-editor/circle.box-editor";
import { PathBoxEditor } from "@/webview/box-editor/path.box-editor";


export const rectBoxEditor = new RectBoxEditor();
export const polyBoxEditor = new PolyBoxEditor();
export const lineBoxEditor = new LineBoxEditor();
export const ellipseBoxEditor = new EllipseBoxEditor();
export const circleBoxEditor = new CircleBoxEditor();
export const pathBoxEditor = new PathBoxEditor();
