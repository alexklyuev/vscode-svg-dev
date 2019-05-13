import { WebviewEndpoint } from "../services/endpoint/webview-endpoint";
import { Pipe, PipeEndpoint } from "../../../shared/services/pipe/pipe";
import { ArtboardStyleRequest, ArtboardStyleResponse } from "../../../shared/pipes/artboard-style.pipe";
import { Artboard } from "../services/artboard/artboard";
import { setState } from "../decorators/set-state.decorator";


/**
 * 
 */
export class ArtboardStyleListener {
    artboardStyleClient: PipeEndpoint<ArtboardStyleRequest, ArtboardStyleResponse, "artboard-style">;

    constructor(
        private webviewEndpoint: WebviewEndpoint,
        private artboardStylePipe: Pipe<ArtboardStyleRequest, ArtboardStyleResponse, 'artboard-style'>,
        private artboard: Artboard,
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
        svg.style[this.fromCssToJsNotation(styleName) as any] = styleValue;
    }

    /**
     * @todo move to dedicated service
     */
    fromCssToJsNotation(cssString: string): string {
        return cssString.replace(/-\w/g, substr => {
            return String.fromCharCode(substr.charCodeAt(1) - 32);
        });
    }

    /**
     * @todo move to dedicated service
     */
    fromJsToCssNotation(jsString: string): string {
        let cssString = '';
        for (let char of jsString) {
            const code = char.charCodeAt(0);
            if (code <= 90) {
                cssString += '-' + String.fromCharCode(code + 32);
            } else {
                cssString += char;
            }
        }
        return cssString;
    }

}
