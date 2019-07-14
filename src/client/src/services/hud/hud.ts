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
        if (text) {
            this.hintEl = document.createElement('div');
            this.hintOutletEl.appendChild(this.hintEl);
            this.hintEl.innerHTML= `${ text }`;
            Object.assign(this.hintEl.style, {
                margin: '10px',
                padding: '3px',
                background: '#333',
                'border-radius': '5px',
            });
        } else {
            if (this.hintEl) {
                this.hintOutletEl.removeChild(this.hintEl);
                this.hintEl = null;
            }
        }
    }

}