import { Sprite } from "@/webview/models/sprite.model";
import { Resolver } from "./resolvers/resolver.model";
import { NameResolver } from "./resolvers/name.resolver";
import { CtorResolver } from "./resolvers/ctor.resolver";


export class SpritesCollection<T extends Sprite<any> = Sprite<any>> {

    private types = new Set<T>();

    public resolvers = Array<Resolver>(
        new NameResolver,
        new CtorResolver,
    );

    add(...types: T[]) {
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

    getFiltered<K extends keyof T>(key: K): T[] {
        return Array.from(this.types).filter(t => !!t[key]);
    }

}
