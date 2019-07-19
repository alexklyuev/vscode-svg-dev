import { AppearanceRequest, AppearanceResponse } from "../../../../shared/pipes/appearance.pipe";
import { PipeEndpoint } from "../../../../shared/services/pipe/pipe";
import { Appearance } from "../appearance/appearance";
import { connectEvent, ClientEvent } from "../../entities/client-event";
import { Artboard } from "../artboard/artboard";
import { ArtboardListener } from "../../listeners/artboard.listener";
import { ArtboardRequest, ArtboardResponse } from "../../../../shared/pipes/artboard.pipe";

const enum HudEvents {
    appearanceRequest = 'appearanceRequest',
}

export class Hud {

    public readonly [HudEvents.appearanceRequest] = new ClientEvent<Promise<AppearanceResponse>>();

    private element: HTMLElement;

    private aprOutlet: HTMLElement;

    private hintOutletEl: HTMLElement;
    private hintEl: HTMLElement | null = null;

    private fillEl: HTMLElement;
    private fillBtn: HTMLElement;

    private strokeEl: HTMLElement;
    private strokeBtn: HTMLElement;

    private artboardEl: HTMLElement;
    private abWidth: HTMLElement;
    private abHeight: HTMLElement;

    constructor(
        public readonly apr: Appearance,
        public readonly appearanceProducer: PipeEndpoint<AppearanceRequest, AppearanceResponse, 'appearance'>,
        public readonly artboard: Artboard,
        public readonly artboardListener: ArtboardListener,
        public readonly artboardInverseEndpoint: PipeEndpoint<ArtboardRequest, ArtboardResponse, 'artboard-inverse'>,
    ) {
        this.element = document.querySelector<HTMLElement>('#hud')!;
        Object.assign(this.element.style, {
            position: 'fixed',
            left: '0',
            top: '0',
        });
        this.aprOutlet = document.createElement('div');
        this.element.appendChild(this.aprOutlet);
        this.hintOutletEl = document.createElement('div');
        this.element.appendChild(this.hintOutletEl);

        Object.assign(this.aprOutlet.style, {
            'margin-top': '10px',
            'margin-left': '10px',
        });

        this.artboardEl = document.createElement('div');
        this.abWidth = document.createElement('span');
        this.abHeight = document.createElement('span');

        this.aprOutlet.appendChild(this.artboardEl);
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
            padding: '3px 10px 3px 10px',
            background: 'rgba(42,42,42,.7)',
            'border-radius': '5px',
            color: '#eee',
            'font-size': '10px',
            display: 'inline-block',
            'user-select': 'none',
        });

        this.abHeight.innerHTML = `${ this.artboard.height }`;
        this.abWidth.innerHTML = `${ this.artboard.width }`;

        [this.abHeight, this.abWidth].forEach(el => {
            Object.assign(el.style, {
                cursor: 'pointer',
                padding: '1px 3px',
                border: '1px solid rgba(255,255,255,.1)',
                'border-radius': '5px',
            });
        });

        this.fillEl = document.createElement('span');
        Object.assign(this.fillEl.style, {
            margin: '10px 2px 0px 0px',
            padding: '3px 10px 3px 10px',
            background: 'rgba(42,42,42,.7)',
            'border-radius': '5px',
            color: '#eee',
            'font-size': '10px',
            display: 'inline-block',
            'user-select': 'none',
        });
        this.fillEl.innerHTML = `fill: `;
        this.fillBtn = document.createElement('span');
        Object.assign(this.fillBtn.style, {
            'margin-left': '3px',
            'margin-bottom': '-2px',
            display: 'inline-block',
            width: '10px',
            height: '10px',
            background: this.representColorButtonBackground(this.apr.fill),
            border: this.representColorButtonBorder(this.apr.fill),
            'border-radius': '50%',
            cursor: 'pointer',
        });
        this.fillEl.appendChild(this.fillBtn);
        this.aprOutlet.appendChild(this.fillEl);

        this.fillBtn.onclick = async (_event: MouseEvent) => {
            const response = await this.makeAppearanceGetRequest({
                name: 'fill',
                value: this.apr.fill,
            });
            if (response) {
                const { value } = response;
                this.apr.fill = value;
                Object.assign(this.fillBtn.style, {
                    background: this.representColorButtonBackground(value),
                    border: this.representColorButtonBorder(value),
                });
            }
        };

        this.strokeEl = document.createElement('span');
        Object.assign(this.strokeEl.style, {
            margin: '10px 10px 0px 0px',
            padding: '3px 10px 3px 10px',
            background: 'rgba(42,42,42,.7)',
            'border-radius': '5px',
            color: '#eee',
            'font-size': '10px',
            display: 'inline-block',
            'user-select': 'none',
        });
        this.strokeEl.innerHTML = `stroke: `;
        this.strokeBtn = document.createElement('span');
        Object.assign(this.strokeBtn.style, {
            'margin-left': '3px',
            'margin-bottom': '-2px',
            display: 'inline-block',
            width: '10px',
            height: '10px',
            background: this.representColorButtonBackground(this.apr.stroke),
            border: this.representColorButtonBorder(this.apr.stroke),
            'border-radius': '50%',
            cursor: 'pointer',
        });
        this.strokeEl.appendChild(this.strokeBtn);
        this.aprOutlet.appendChild(this.strokeEl);

        this.strokeBtn.onclick = async (_event: MouseEvent) => {
            const response = await this.makeAppearanceGetRequest({
                name: 'stroke',
                value: this.apr.stroke,
            });
            if (response) {
                const { value } = response;
                this.apr.stroke = value;
                Object.assign(this.strokeBtn.style, {
                    background: this.representColorButtonBackground(value),
                    border: this.representColorButtonBorder(value),
                });
            }
        };

        this.abWidth.onclick = async (_event: MouseEvent) => {
            const { value } = await this.artboardInverseEndpoint.makeGetRequest({
                property: 'width',
                value: `${this.artboard.width}`,
            });
            this.artboardListener.updateAttributes(this.artboard.svg, 'width', value!);
        };

        this.abHeight.onclick = async (_event: MouseEvent) => {
            const { value } = await this.artboardInverseEndpoint.makeGetRequest({
                property: 'height',
                value: `${this.artboard.height}`,
            });
            this.artboardListener.updateAttributes(this.artboard.svg, 'height', value!);
        };

        this.artboardListener.changeProperty.on(({property, value}) => {
            if (property === 'width') {
                this.updateArtboardWidth(value);
            }
            if (property === 'height') {
                this.updateArtboardHeight(value);
            }
        });

    } // end of constructor

    @connectEvent(HudEvents.appearanceRequest)
    async makeAppearanceGetRequest(request: AppearanceRequest): Promise<AppearanceResponse> {
        return await this.appearanceProducer.makeGetRequest(request);
    }

    set hint(text: string | null) {
        if (this.hintEl) {
            this.hintOutletEl.removeChild(this.hintEl);
            this.hintEl = null;
        }
        if (text) {
            this.hintEl = document.createElement('div');
            this.hintOutletEl.appendChild(this.hintEl);
            const hintClose = document.createElement('span');
            hintClose.innerHTML = `✕`;
            Object.assign(hintClose.style, {
                padding: '10px',
                cursor: 'pointer',
            });
            hintClose.onclick = event => {
                event.preventDefault();
                event.stopPropagation();
                this.hint = null;
            };
            this.hintEl.appendChild(hintClose);
            const hintText = document.createElement('span');
            hintText.innerHTML = `${ text }`;
            this.hintEl.appendChild(hintText);
            Object.assign(this.hintEl.style, {
                margin: '10px 10px 10px 10px',
                padding: '3px',
                background: 'rgba(42,42,42,.7)',
                'border-radius': '5px',
                color: '#eee',
                'font-size': '10px',
            });
        }
    }

    representColorButtonBackground(color: string): string {
        switch (color) {
            case '':
            case 'none':
            case undefined:
            case null:
                return `rgba(0,0,0,0)`;
            default:
                return color;
        }
    }

    representColorButtonBorder(color: string): string {
        switch (color) {
            case '':
            case 'none':
            case undefined:
            case null:
                return `1px solid dashed`;
            default:
                return `1px solid white`;
        }
    }

    updateFillBtn(value: string) {
        Object.assign(this.fillBtn.style, {
            background: this.representColorButtonBackground(value),
            border: this.representColorButtonBorder(value),
        });
    }

    updateStrokeBtn(value: string) {
        Object.assign(this.strokeBtn.style, {
            background: this.representColorButtonBackground(value),
            border: this.representColorButtonBorder(value),
        });
    }

    updateArtboardWidth(value: string | number) {
        this.abWidth.innerHTML = `${ value }`;
    }

    updateArtboardHeight(value: string | number) {
        this.abHeight.innerHTML = `${ value }`;
    }

}