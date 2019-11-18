import { Pipe, PipeEndpoint } from "@/common/pipe/pipe";
import { webviewEndpoint } from "&resolve/webview-endpoint";

import { RemoteAttributeRequest, RemoteAttributeResponse } from "@/shared/pipes/remote-attribute.pipe";
import { ElementHolder } from "@/webview/services/holder/element-holder";
import { setState } from "&resolve/decorators/set-state.decorator";
import { rehold } from "@/webview/decorators/rehold.decorator";


export class RemoteAttributeListener {
    remoteAttributeClient: PipeEndpoint<RemoteAttributeRequest, RemoteAttributeResponse, "remoteAttribute">;

    constructor(
        private remoteAttributePipe: Pipe<RemoteAttributeRequest, RemoteAttributeResponse, 'remoteAttribute'>,
        private holder: ElementHolder,
    ) {
        this.remoteAttributeClient = webviewEndpoint.createFromPipe(this.remoteAttributePipe);
    }

    /**
     * 
     */
    listen() {
        this.remoteAttributeClient.listenGetRequest(
            _request => this.holder.elements,
            ({ attribute }, element) => {
                const value = this.getAttribute(element[0], attribute);
                return {value};
            },
        );
        this.remoteAttributeClient.listenSetRequest(
            _request => this.holder.elements,
            ({ attribute, value }, elements) => {
                elements.forEach(element => {
                    if (value) {
                        this.setAttribute(element, attribute, value);
                    } else if (typeof value === 'string' && value.trim() === '') {
                        this.removeAttribute(element, attribute);
                    }
                });
            },
        );
    }

    /**
     * 
     */
    getAttribute(element: SVGElement, attribute: string): string {
        switch (attribute) {
            case 'innerText': return element.innerHTML;
            default: return element.getAttribute(attribute)!;
        }
    }

    /**
     * 
     */
    // @updateSelection
    @rehold
    @setState
    setAttribute(element: SVGElement, attribute: string, value: string) {
        switch (attribute) {
            case 'innerText': element.innerHTML = value; break;
            default: element.setAttribute(attribute, value); break;
        }
    }

    /**
     * 
     */
    // @updateSelection
    @rehold
    @setState
    removeAttribute(element: SVGElement, attribute: string) {
        switch (attribute) {
            case 'innerText': element.innerHTML = ''; break;
            default: element.removeAttribute(attribute);
        }
    }

}
