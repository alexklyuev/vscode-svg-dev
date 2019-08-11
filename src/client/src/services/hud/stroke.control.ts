import { Appearance } from "../appearance/appearance";
import { ColorRepresenterService } from "./color-representer.service";
import { EventBus, connectEvent } from "../../../../lib/common/events";
import { PipeEndpoint } from "../../../../lib/common/pipe/pipe";
import { AppearanceRequest, AppearanceResponse } from "../../../../shared/pipes/appearance.pipe";


const enum StrokeControlEvents {
    appearanceRequest = 'appearanceRequest',
}

export class StrokeControl {

    public readonly [StrokeControlEvents.appearanceRequest] = new EventBus<Promise<AppearanceResponse>>();

    private strokeEl: HTMLElement;
    private strokeBtn: HTMLElement;

    constructor(
        private apr: Appearance,
        private colorRepresenter: ColorRepresenterService,
        private readonly appearanceProducer: PipeEndpoint<AppearanceRequest, AppearanceResponse, 'appearance'>,
    ) {
        this.strokeEl = document.createElement('span');
        Object.assign(this.strokeEl.style, {
            margin: '10px 3px 0px 0px',
            padding: '4px 10px',
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
            background: this.colorRepresenter.representColorButtonBackground(this.apr.stroke),
            border: this.colorRepresenter.representColorButtonBorder(this.apr.stroke),
            'border-radius': '50%',
            cursor: 'pointer',
        });
        this.strokeEl.appendChild(this.strokeBtn);
        this.strokeBtn.onclick = async (_event: MouseEvent) => {
            const response = await this.makeAppearanceGetRequest({
                name: 'stroke',
                value: this.apr.stroke,
            });
            if (response) {
                const { value } = response;
                this.apr.stroke = value;
                Object.assign(this.strokeBtn.style, {
                    background: this.colorRepresenter.representColorButtonBackground(value),
                    border: this.colorRepresenter.representColorButtonBorder(value),
                });
            }
        };
    }

    appendTo(parentElement: HTMLElement) {
        parentElement.appendChild(this.strokeEl);
    }

    @connectEvent(StrokeControlEvents.appearanceRequest)
    async makeAppearanceGetRequest(request: AppearanceRequest): Promise<AppearanceResponse> {
        return await this.appearanceProducer.makeGetRequest(request);
    }

    updateStrokeBtn(value: string) {
        Object.assign(this.strokeBtn.style, {
            background: this.colorRepresenter.representColorButtonBackground(value),
            border: this.colorRepresenter.representColorButtonBorder(value),
        });
    }

}