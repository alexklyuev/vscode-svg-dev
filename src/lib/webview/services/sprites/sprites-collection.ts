import { Sprite } from "@/webview/models/sprite.model";
import { Resolver } from "@/webview/services/sprites/resolvers/resolver.model";
import { NameResolver } from "@/webview/services/sprites/resolvers/name.resolver";
import { CtorResolver } from "@/webview/services/sprites/resolvers/ctor.resolver";
import { AttributeResolver } from "@/webview/services/sprites/resolvers/attribute.resolver";


export class SpritesCollection<T extends Sprite<any> = Sprite<any>> {

    private sprites = new Set<T>();

    public resolvers = Array<Resolver>(
        new AttributeResolver,
        new NameResolver,
        new CtorResolver,
    );

    add(...types: T[]) {
        types.forEach(type => this.sprites.add(type));
    }

    resolve(element: {} | string) {
        for (let resolver of this.resolvers) {
            const localResult = resolver.find(this.sprites, element);
            if (localResult) {
                return localResult;
            }
        }
        return null;
    }

    toArray() {
        return Array.from(this.sprites);
    }

}
