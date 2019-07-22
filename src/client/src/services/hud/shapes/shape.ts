import { connectEvent, ClientEvent } from "../../../entities/client-event";


export class Shape {

  public readonly createEvent = new ClientEvent<MouseEvent>();

  private el: HTMLElement;

  constructor(
    public readonly name: string,
    private readonly iconSvg: string,
  ) {
    this.el = document.createElement('div');
    Object.assign(this.el.style, {
      display: 'inline-block',
      padding: '3px 3px',
      margin: '2px',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: '3px',
      cursor: 'pointer',
      background: 'rgba(42,42,42,.7)',
      color: '#eee',
      'font-size': '10px',
      'user-select': 'none',
    });
    const nameEl = document.createElement('span');
    nameEl.innerText = this.name;
    const iconEl = document.createElement('span');
    iconEl.innerHTML = this.iconSvg;
    this.el.appendChild(iconEl);
    this.el.appendChild(nameEl);
    iconEl.setAttribute('title', this.name);
    this.el.onclick = (event: MouseEvent) => {
      this.create(event);
    };
  }

  appendTo(parentElement: HTMLElement) {
    parentElement.appendChild(this.el);
  }

  @connectEvent('createEvent')
  create(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    return event;
  }

}
