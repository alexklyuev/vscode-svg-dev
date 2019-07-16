import { Appearance } from "../appearance/appearance";

export class Hud {
    private element: HTMLDivElement;

    private aprOutlet: HTMLDivElement;

    private hintOutletEl: HTMLDivElement;
    private hintEl: HTMLDivElement | null = null;

    private fillEl: HTMLElement;
    private fillBtn: HTMLElement;

    private strokeEl: HTMLElement;
    private strokeBtn: HTMLElement;

    constructor(
        public readonly apr: Appearance,
    ) {
        this.element = document.querySelector<HTMLDivElement>('#hud')!;
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
        });

        this.fillEl = document.createElement('span');
        Object.assign(this.fillEl.style, {
            margin: '10px 2px 10px 10px',
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
            background: this.apr.fill,
            border: '1px solid white',
            'border-radius': '50%',
            cursor: 'pointer',
        });
        this.fillEl.appendChild(this.fillBtn);
        this.aprOutlet.appendChild(this.fillEl);

        this.strokeEl = document.createElement('span');
        Object.assign(this.strokeEl.style, {
            margin: '10px 10px 10px 0px',
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
            background: this.apr.stroke,
            border: '1px solid white',
            'border-radius': '50%',
            cursor: 'pointer',
        });
        this.strokeEl.appendChild(this.strokeBtn);
        this.aprOutlet.appendChild(this.strokeEl);

    } // end of constructor

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
                margin: '10px',
                padding: '3px',
                background: 'rgba(42,42,42,.7)',
                'border-radius': '5px',
                color: '#eee',
                'font-size': '10px',
            });
        }
    }

}