import { Appearance } from "../appearance/appearance";

export class StrokeControl {

    private strokeEl: HTMLElement;
    private strokeBtn: HTMLElement;

    constructor(
        private apr: Appearance,
    ) {
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
    }

}