import { MoverAbstract } from "@/webview/movers/mover-abstract";
import { figuresCollection } from "@/webview/services/figures-collection";


export class MoverDelegate extends MoverAbstract {

  by(element: SVGElement, {x, y}: {x: number, y: number}) {
    Array.from(element.children).forEach(child => {
      const delegate = figuresCollection.delegate(child);
      if (delegate && delegate.move) {
        delegate.move.by(child as SVGElement, {x, y});
      }
    });
  }

}
