import { WebviewEndpoint } from "../services/endpoint/webview-endpoint";
import { Pipe, PipeEndpoint } from "../../../shared/services/pipe/pipe";
import { ArtboardStyleRequest, ArtboardStyleResponse } from "../../../shared/pipes/artboard-style.pipe";
import { Artboard } from "../services/artboard/artboard";
import { setState } from "../decorators/set-state.decorator";
import { CssJsNotationConverter } from "../../../shared/services/css/css-js-notation-converter";


/**
 * 
 */
export class ArtboardStyleListener {
    private artboardStyleClient: PipeEndpoint<ArtboardStyleRequest, ArtboardStyleResponse, "artboard-style">;

    constructor(
        private webviewEndpoint: WebviewEndpoint,
        private artboardStylePipe: Pipe<ArtboardStyleRequest, ArtboardStyleResponse, 'artboard-style'>,
        private artboard: Artboard,
        private notationConverter: CssJsNotationConverter,
    ) {
        this.artboardStyleClient = this.webviewEndpoint.createFromPipe(this.artboardStylePipe);
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
