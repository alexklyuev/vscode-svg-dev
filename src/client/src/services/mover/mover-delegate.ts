import { MoverAbstract } from "./mover-abstract";
import { FiguresCollection } from "../../figures/figures-collection";

export class MoverDelegate extends MoverAbstract {

  constructor(
    private readonly figuresCollection: FiguresCollection
  ) {
    super();
  }

  by(element: SVGElement, {x, y}: {x: number, y: number}) {
    Array.from(element.children).forEach(child => {
      const delegate = this.figuresCollection.delegate(child);
      if (delegate && delegate.move) {
        delegate.move.by(child as SVGElement, {x, y});
      }
    });
  }

}
