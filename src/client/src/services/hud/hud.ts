export class Hud {
    private element: HTMLDivElement;

    private aprOutlet: HTMLDivElement;

    private hintOutletEl: HTMLDivElement;
    private hintEl: HTMLDivElement | null = null;

    constructor() {
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

        const fillEl = document.createElement('span');
        Object.assign(fillEl.style, {
            margin: '10px',
            padding: '3px 10px 3px 10px',
            background: 'rgba(42,42,42,.7)',
            'border-radius': '5px',
            color: '#eee',
            'font-size': '10px',
            display: 'flex',
            'user-select': 'none',
        });
        fillEl.innerHTML = `fill: `;
        const fillBtn = document.createElement('span');
        Object.assign(fillBtn.style, {
            'margin-left': '3px',
            display: 'inline-block',
            width: '10px',
            height: '10px',
            background: '#aaa',
            border: '1px solid white',
            'border-radius': '50%',
            cursor: 'pointer',
        });
        fillEl.appendChild(fillBtn);
        this.aprOutlet.appendChild(fillEl);
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