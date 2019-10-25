import { Sprite } from "@/webview/models/sprite.model";
import { Resolver } from "./resolvers/resolver.model";
import { NameResolver } from "./resolvers/name.resolver";
import { CtorResolver } from "./resolvers/ctor.resolver";


export class SpritesCollection {

    private types = new Set<Sprite<any>>();

    public resolvers = Array<Resolver>(
        new NameResolver,
        new CtorResolver,
    );

    add(...types: Sprite<any>[]) {
        types.forEach(type => this.types.add(type));
    }

    resolve(element: {} | string) {
        for (let resolver of this.resolvers) {
            const localResult = resolver.find(this.types, element);
            if (localResult) {
                return localResult;
            }
        }
        return null;
    }

    getFiltered<K extends keyof Sprite<any>>(key: K): Sprite<any>[] {
        return Array.from(this.types).filter(t => !!t[key]);
    }

}
