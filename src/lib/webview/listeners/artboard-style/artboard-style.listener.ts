import { PipeEndpoint } from "@/common/pipe/pipe";
import { webviewEndpoint } from "&resolve/webview-endpoint";
import { artboard } from "@/web/init";

import { ArtboardStyleRequest, ArtboardStyleResponse, artboardStylePipe } from "@/shared/pipes/artboard-style.pipe";
import { setState } from "&resolve/decorators/set-state.decorator";
import { CssJsNotationConverter } from "@/shared/services/css/css-js-notation-converter";
import { PipeTags } from "@/shared/pipes/tags";


/**
 * 
 */
export class ArtboardStyleListener {
    private artboardStyleClient: PipeEndpoint<ArtboardStyleRequest, ArtboardStyleResponse, PipeTags.artboardStyle>;
    private notationConverter = new CssJsNotationConverter();

    constructor() {
        this.artboardStyleClient = webviewEndpoint.createFromPipe(artboardStylePipe);
    }

    /**
     * 
     */
    listen() {
        this.artboardStyleClient.listenSetRequest(
            _request => artboard.svg,
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
