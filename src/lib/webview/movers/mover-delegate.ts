import { MoverAbstract } from "@/webview/movers/mover-abstract";
import { sprites } from "@/webview/services/sprites";


export class MoverDelegate extends MoverAbstract {

  by(element: SVGElement, {x, y}: {x: number, y: number}) {
    Array.from(element.children).forEach(child => {
      const delegate = sprites.resolve(child);
      if (delegate && delegate.moveOperator) {
        delegate.moveOperator.by(child as SVGElement, {x, y});
      }
    });
  }

}
