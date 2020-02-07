import { BaseCreateOperator } from "@/webview/creators/base.create-operator";
import { artboard } from "@/web/init";
import { userEventMan } from "@/webview/services/user-event";
import { PointConcerns } from "@/webview/models/point-concerns.model";


export class ArrowCreateOperator extends BaseCreateOperator {

    makeElement() {
        return new Promise(resolve => {
            const points = Array<PointConcerns>();
            artboard.box.style.cursor = 'crosshair';
            let destroyTempRenderFn: Function | null = null;
            userEventMan.mode = 'interactive';
            const { svg } = artboard;
        });
    }

}
