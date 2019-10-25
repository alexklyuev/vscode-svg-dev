import { Sprite } from "@/webview/models/sprite.model";
import { Resolver } from "@/webview/services/sprites/resolvers/resolver.model";


export class InstanceResolver implements Resolver {

    find(collection: Set<Sprite<any>>, param: any): Sprite<any> | null {
        if (typeof param === 'object' && param !== null) {
            for (let sprite of collection) {
                if (param instanceof sprite.ctor) {
                    return sprite;
                }
            }
        }
        return null;
    }

}
