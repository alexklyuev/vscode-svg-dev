import { Sprite } from "@/webview/models/sprite.model";


export interface Resolver {

    find(collection: Set<Sprite<any>>, param: any): Sprite<any> | null;

}
