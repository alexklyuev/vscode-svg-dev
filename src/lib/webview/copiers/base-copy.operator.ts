import { CopyOperator } from "@/webview/models/operators/copy-operator.model";
import { spawner } from "@/dom/spawner";
import { artboard } from "@/web/init";
import { setState } from "&resolve/decorators/set-state.decorator";


export class BaseCopyOperator implements CopyOperator {

    @setState
    copy(el: SVGElement): SVGElement {
        const outer = el.outerHTML;
        const g = spawner.svg.create('g');
        g.innerHTML = outer;
        const copy = g.children[0] as SVGElement;
        copy.removeAttribute('id');
        const svg = artboard.svg;
        svg.insertBefore(copy, el);
        el.insertAdjacentElement('afterend', copy);
        g.remove();
        return copy;
    }

}
