import { ColorRepresenterService } from "./color-representer.service";
import { Appearance } from "../appearance/appearance";
import { EventBus, connectEvent } from "../../../../lib/common/events";
import { AppearanceResponse, AppearanceRequest } from "../../../../shared/pipes/appearance.pipe";
import { PipeEndpoint } from "../../../../lib/common/pipe/pipe";
import { Outlet } from "./models/outlet.model";


const enum FillControlEvents {
    appearanceRequest = 'appearanceRequest',
}

export class FillControl implements Outlet {

    public readonly [FillControlEvents.appearanceRequest] = new EventBus<Promise<AppearanceResponse>>();

    private fillEl: HTMLElement;
    private fillBtn: HTMLElement;

    constructor(
        private apr: Appearance,
        private colorRepresenter: ColorRepresenterService,
        private readonly appearanceProducer: PipeEndpoint<AppearanceRequest, AppearanceResponse, 'appearance'>,
    ) {
        this.fillEl = document.createElement('span');
        Object.assign(this.fillEl.style, {
            margin: '10px 2px 0px 0px',
            padding: '4px 10px',
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
            background: this.colorRepresenter.representColorButtonBackground(this.apr.fill),
            border: this.colorRepresenter.representColorButtonBorder(this.apr.fill),
            'border-radius': '50%',
            cursor: 'pointer',
        });
        this.fillEl.appendChild(this.fillBtn);

        this.fillBtn.onclick = async (_event: MouseEvent) => {
            const response = await this.makeAppearanceGetRequest({
                name: 'fill',
                value: this.apr.fill,
            });
            if (response) {
                const { value } = response;
                this.apr.fill = value;
                Object.assign(this.fillBtn.style, {
                    background: this.colorRepresenter.representColorButtonBackground(value),
                    border: this.colorRepresenter.representColorButtonBorder(value),
                });
            }
        };
    }

    appendTo(parentElement: HTMLElement) {
        parentElement.appendChild(this.fillEl);
    }

    @connectEvent(FillControlEvents.appearanceRequest)
    async makeAppearanceGetRequest(request: AppearanceRequest): Promise<AppearanceResponse> {
        return await this.appearanceProducer.makeGetRequest(request);
    }

    updateFillBtn(value: string) {
        Object.assign(this.fillBtn.style, {
            background: this.colorRepresenter.representColorButtonBackground(value),
            border: this.colorRepresenter.representColorButtonBorder(value),
        });
    }

}