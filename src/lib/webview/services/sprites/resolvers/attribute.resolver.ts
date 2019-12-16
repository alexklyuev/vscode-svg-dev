import { Sprite } from "@/webview/models/sprite.model";
import { Resolver } from "@/webview/services/sprites/resolvers/resolver.model";


export class AttributeResolver implements Resolver {

    constructor(
        private readonly attributeName: string = 'data-svgdev-type',
        private readonly spriteKey: keyof Sprite<any> = 'typeAttribute',
    ) {}

    find(collection: Set<Sprite<any>>, param: any): Sprite<any> | null {
        if (param instanceof SVGElement) {
            const attributeValue = param.getAttribute(this.attributeName);
            if (attributeValue) {
                for (let sprite of collection) {
                    if (sprite[this.spriteKey] === attributeValue) {
                        return sprite;
                    }
                }
            }
        }
        return null;
    }

}
