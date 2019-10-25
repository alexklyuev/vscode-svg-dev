import { Sprite } from "@/webview/models/sprite.model";
import { Resolver } from "@/webview/services/sprites/resolvers/resolver.model";


export class NameResolver implements Resolver {

    find(collection: Set<Sprite<any>>, param: any): Sprite<any> | null {
        if (typeof param === 'string') {
            for (let sprite of collection) {
                if (sprite.name === param) {
                    return sprite;
                }
            }
        }
        return null;
    }

}
