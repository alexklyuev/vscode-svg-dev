export class Hud {
    private element: HTMLDivElement;
    private hintOutletEl: HTMLDivElement;
    private hintEl: HTMLDivElement | null = null;

    constructor() {
        this.element = document.querySelector<HTMLDivElement>('#hud')!;
        Object.assign(this.element.style, {
            position: 'fixed',
            left: '0',
            top: '0',
        });
        this.hintOutletEl = document.createElement('div');
        this.element.appendChild(this.hintOutletEl);
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
            hintClose.onclick = _event => this.hint = null;
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