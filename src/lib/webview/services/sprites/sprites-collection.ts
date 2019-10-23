import { Sprite } from "@/webview/models/sprite.model";


export class SpritesCollection {

    private types = new Set<Sprite<any>>();

    add(...types: Sprite<any>[]) {
        /**
         * add types
         */
        types.forEach(type => this.types.add(type));
    }

    resolve(element: {} | string) {
        for (let type of this.types) {
            if (typeof element === 'object' && type.testByElement(element)) {
                return type;
            } else if (typeof element === 'string' && type.name === element) {
                return type;
            }
        }
    }

    getFiltered<K extends keyof Sprite<any>>(key: K): Sprite<any>[] {
        return Array.from(this.types).filter(t => !!t[key]);
    }

}
