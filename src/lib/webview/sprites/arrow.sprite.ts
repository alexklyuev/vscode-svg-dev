import { Sprite } from "../models/sprite.model";


export class ArrowSprite implements Sprite<SVGPathElement> {

    readonly name = 'svgdev-arrow';

    readonly ctor = null;

    readonly typeAttribute = 'arrow';

    operators = {};

}
