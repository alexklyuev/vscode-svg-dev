import { Listener } from "../../models/listener.model";
import { alignPipe, AlignRequest } from "@/shared/pipes/align.pipe";
import { webviewEndpoint } from "&resolve/webview-endpoint";
import { setState } from "&resolve/decorators/set-state.decorator";
import { holder } from "../../services/holder";
import { sprites } from "../../services/sprites";
import { makeMethodIterator } from "@/common/iterators";
import { zoom } from "@/web/init";


export class AlignListener implements Listener {

    private client = webviewEndpoint.createFromPipe(alignPipe);

    listen() {
        this.client.listenSetRequest(
            _request => true,
            request => {
                this.performAlign(request);
            },
        );
    }

    @makeMethodIterator()
    @setState
    performAlign(request: AlignRequest) {
        if (holder.elements.length < 2) {
            return;
        }
        const keyElement = holder.elements[0];
        const restElements = holder.elements.slice(1);
        const {
            left,
            right,
            top,
            bottom,
            width,
            height,
        } = keyElement.getBoundingClientRect();
        const center = width / 2 + left;
        const middle = height / 2 + top;
        switch (request) {
            case 'left':
                restElements.forEach(el => {
                    const { left: elLeft } = el.getBoundingClientRect();
                    const diff = left - elLeft;
                    const sprite = sprites.resolve(el);
                    if (sprite) {
                        const { moveOperator } = sprite.operators;
                        if (moveOperator) {
                            moveOperator.by(el, {x: diff, y: 0});
                        }
                    }
                });
                break;
            case 'center':
                restElements.forEach(el => {
                    const { left: elLeft, width: elWidth } = el.getBoundingClientRect();
                    const elCenter = elWidth / 2 + elLeft;
                    const diff = center - elCenter;
                    const sprite = sprites.resolve(el);
                    if (sprite) {
                        const { moveOperator } = sprite.operators;
                        if (moveOperator) {
                            moveOperator.by(el, {x: diff / zoom.value, y: 0});
                        }
                    }
                });
                break;
            case 'right':
                restElements.forEach(el => {
                    const { right: elRight } = el.getBoundingClientRect();
                    const diff = right - elRight;
                    const sprite = sprites.resolve(el);
                    if (sprite) {
                        const { moveOperator } = sprite.operators;
                        if (moveOperator) {
                            moveOperator.by(el, {x: diff, y: 0});
                        }
                    }
                });
                break;
            case 'top':
                restElements.forEach(el => {
                    const { top: elTop } = el.getBoundingClientRect();
                    const diff = top - elTop;
                    const sprite = sprites.resolve(el);
                    if (sprite) {
                        const { moveOperator } = sprite.operators;
                        if (moveOperator) {
                            moveOperator.by(el, {x: 0, y: diff});
                        }
                    }
                });
                break;
            case 'middle':
                restElements.forEach(el => {
                    const { top: elTop, height: elHeight } = el.getBoundingClientRect();
                    const elMiddle = elHeight / 2 + elTop;
                    const diff = middle - elMiddle;
                    const sprite = sprites.resolve(el);
                    if (sprite) {
                        const { moveOperator } = sprite.operators;
                        if (moveOperator) {
                            moveOperator.by(el, {x: 0, y: diff / zoom.value});
                        }
                    }
                });
                break;
            case 'bottom':
                restElements.forEach(el => {
                    const { bottom: elBottom } = el.getBoundingClientRect();
                    const diff = bottom - elBottom;
                    const sprite = sprites.resolve(el);
                    if (sprite) {
                        const { moveOperator } = sprite.operators;
                        if (moveOperator) {
                            moveOperator.by(el, {x: 0, y: diff});
                        }
                    }
                });
                break;
        }
    }

}