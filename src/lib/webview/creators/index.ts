import { RectCreateOperator } from "./rect.create-operator";
import { CircleCreateOperator } from "./circle.create-operator";
import { EllipseCreateOperator } from "./ellipse.create-operator";
import { LineCreateOperator } from "./line.create-operator";
import { PathCreateOperator } from "./path.create-operator";
import { TextCreateOperator } from "./text.create-operator";
import { PolygonCreateOperator } from "./polygon.create-operator";
import { PolylineCreateOperator } from "./polyline.create-operator";


export const rectCreateOperator = new RectCreateOperator();
export const circleCreateOperator = new CircleCreateOperator();
export const ellipseCreateOperator = new EllipseCreateOperator();
export const lineCreateOperator = new LineCreateOperator();
export const pathCreateOperator = new PathCreateOperator();
export const textCreateOperator = new TextCreateOperator();
export const polygonCreateOperator = new PolygonCreateOperator();
export const polylineCreateOperator = new PolylineCreateOperator();
