import { artboard } from "@/webview/services/artboard";
import { PipeEndpoint } from "@/common/pipe/pipe";
import { findMethodIterator } from "@/common/iterators";

import { ArtboardStyleRequest, ArtboardStyleResponse } from "../../../shared/pipes/artboard-style.pipe";
import { ColorRepresenterService } from "./color-representer.service";
import { ArtboardRequest, ArtboardResponse } from "../../../shared/pipes/artboard.pipe";
import { Outlet } from "./models/outlet.model";
import { ArtboardStyleListener } from "../listeners/artboard-style.listener";
import { ArtboardListener } from "../listeners/artboard.listener";


export class ArtboardControls implements Outlet {

    private artboardEl: HTMLElement;
    private abWidth: HTMLElement;
    private abHeight: HTMLElement;
    private abColor: HTMLElement;

    constructor(
        private readonly artboardStyleConsumer: ArtboardStyleListener,
        private readonly artboardStyleProducer: PipeEndpoint<ArtboardStyleRequest, ArtboardStyleResponse, 'artboard-style-inverse'>,
        private readonly colorRepresenter: ColorRepresenterService,
        private readonly artboardListener: ArtboardListener,
        private readonly artboardInverseEndpoint: PipeEndpoint<ArtboardRequest, ArtboardResponse, 'artboard-inverse'>,
    ) {
        this.artboardEl = document.createElement('div');
        this.abWidth = document.createElement('span');
        this.abHeight = document.createElement('span');
        this.abColor = document.createElement('span');
        this.artboardEl.innerHTML = 'artboard: ';
        this.artboardEl.appendChild(this.abWidth);
        const x = document.createElement('span');
        x.innerHTML = 'x';
        Object.assign(x.style, {
            'padding-left': '2px',
            'padding-right': '2px',
        });
        this.artboardEl.appendChild(x);
        this.artboardEl.appendChild(this.abHeight);

        Object.assign(this.artboardEl.style, {
            margin: '10px 2px 0px 0px',
            padding: '4px 10px',
            background: 'rgba(42,42,42,.7)',
            'border-radius': '5px',
            color: '#eee',
            'font-size': '10px',
            display: 'inline-block',
            'user-select': 'none',
        });

        this.abHeight.innerHTML = `${ artboard.height }`;
        this.abWidth.innerHTML = `${ artboard.width }`;

        [this.abHeight, this.abWidth].forEach(el => {
            Object.assign(el.style, {
                cursor: 'pointer',
                padding: '1px 3px',
                border: '1px solid rgba(255,255,255,.1)',
                'border-radius': '5px',
            });
        });

        this.abColor = document.createElement('span');
        this.artboardEl.appendChild(this.abColor);
        const bg = artboard.svg.style.backgroundColor!;
        Object.assign(this.abColor.style, {
            'margin-left': '7px',
            'margin-bottom': '-2px',
            display: 'inline-block',
            width: '10px',
            height: '10px',
            background: this.colorRepresenter.representColorButtonBackground(bg),
            border: this.colorRepresenter.representColorButtonBorder(bg),
            'border-radius': '50%',
            cursor: 'pointer',
        });
        this.abColor.onclick = async (_event: MouseEvent) => {
            const { styleValue } = await this.artboardStyleProducer.makeGetRequest({
                styleName: 'background',
                styleValue: bg,
            });
            this.artboardStyleConsumer.setStyle(artboard.svg, 'background', styleValue!);
            Object.assign(this.abColor.style, {
                background: this.colorRepresenter.representColorButtonBackground(styleValue!),
                border: this.colorRepresenter.representColorButtonBorder(styleValue!),
            });
        };
        this.abWidth.onclick = async (_event: MouseEvent) => {
            const { value } = await this.artboardInverseEndpoint.makeGetRequest({
                property: 'width',
                value: `${artboard.width}`,
            });
            this.artboardListener.updateAttributes(artboard.svg, 'width', value!);
        };

        this.abHeight.onclick = async (_event: MouseEvent) => {
            const { value } = await this.artboardInverseEndpoint.makeGetRequest({
                property: 'height',
                value: `${artboard.height}`,
            });
            this.artboardListener.updateAttributes(artboard.svg, 'height', value!);
        };

        // this.artboardListener.changeProperty.on(({property, value}) => {
        //     if (property === 'width') {
        //         this.updateArtboardWidth(value);
        //     }
        //     if (property === 'height') {
        //         this.updateArtboardHeight(value);
        //     }
        // });
        (async () => {
            const artboardAttributesUpdates = findMethodIterator(this.artboardListener.updateAttributes);
            for await (const { property, value } of artboardAttributesUpdates) {
                if (property === 'width') {
                    this.updateArtboardWidth(value);
                }
                if (property === 'height') {
                    this.updateArtboardHeight(value);
                }
            }
        })();
    }

    appendTo(parentElement: HTMLElement) {
        parentElement.appendChild(this.artboardEl);
    }

    updateArtboardWidth(value: string | number) {
        this.abWidth.innerHTML = `${ value }`;
    }

    updateArtboardHeight(value: string | number) {
        this.abHeight.innerHTML = `${ value }`;
    }

}
