import { Mover } from "@/webview/models/operators/move-operator.model";
import { MoveArrowKeys } from "../../shared/pipes/move-key.pipe";


export abstract class MoverAbstract implements Mover {

  abstract by(element: SVGElement, {x, y}: {x: number, y: number}): void;

  byKey(element: SVGElement, key: MoveArrowKeys, shift: boolean): void {
    let x = 0, y = 0;
    switch (key) {
      case 'left': x = -1; break;
      case 'up': y = -1; break;
      case 'right': x = 1; break;
      case 'down': y = 1; break;
    }
    if (shift) {
      x *= 10;
      y *= 10;
    }
    this.by(element, {x, y});
  }

}
