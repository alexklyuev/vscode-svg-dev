import { Sprite } from "@/webview/models/sprite.model";


export interface RotateOperator {

    rotate(element: SVGElement, shape: Sprite<any>): void;

}
