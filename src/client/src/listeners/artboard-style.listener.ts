import { Pipe, PipeEndpoint } from "@/common/pipe/pipe";
import { webviewEndpoint } from "@/webview/services/webview-endpoint";

import { ArtboardStyleRequest, ArtboardStyleResponse } from "../../../shared/pipes/artboard-style.pipe";
import { Artboard } from "../services/artboard/artboard";
import { setState } from "../decorators/set-state.decorator";
import { CssJsNotationConverter } from "../../../shared/services/css/css-js-notation-converter";
import { PipeTags } from "../../../shared/pipes/tags";


/**
 * 
 */
export class ArtboardStyleListener {
    private artboardStyleClient: PipeEndpoint<ArtboardStyleRequest, ArtboardStyleResponse, PipeTags.artboardStyle>;

    constructor(
        private artboardStylePipe: Pipe<ArtboardStyleRequest, ArtboardStyleResponse, PipeTags.artboardStyle>,
        private artboard: Artboard,
        private notationConverter: CssJsNotationConverter,
    ) {
        this.artboardStyleClient = webviewEndpoint.createFromPipe(this.artboardStylePipe);
    }

    /**
     * 
     */
    listen() {
        this.artboardStyleClient.listenSetRequest(
            _request => this.artboard.svg,
            ({ styleName, styleValue }, svg) => {
                this.setStyle(svg, styleName, styleValue!);
            },
        );
    }

    /**
     * 
     */
    @setState
    setStyle(svg: SVGElement, styleName: string, styleValue: string) {
        svg.style[this.notationConverter.fromCssToJsNotation(styleName) as any] = styleValue;
    }

}
