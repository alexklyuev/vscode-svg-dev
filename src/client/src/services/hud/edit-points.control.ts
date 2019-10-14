import { makeMethodIterator } from "@/common/iterators";
import { Outlet } from "./models/outlet.model";
import { Spawn } from "../../../../lib/dom/spawner/spawn";


export class EditPointsControl implements Outlet {

  private el: HTMLElement;
  
//   private svg = `
// <svg width="8" height="8" viewBox="0 0 8 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="background: none;">
// <g><circle fill="none" stroke="white" cx="6.9366666666666665" cy="6.166666666666666" r=".5" stroke-width=".5" stroke-linecap="round" stroke-linejoin="round"></circle><line x1="6.66" y1="6.3" x2="0.7" y2="7.9" stroke="white" fill="none" stroke-width=".3" stroke-dasharray=".5"></line><circle fill="none" stroke="white" cx="1.2766666666666664" cy="3.706666666666666" r=".5" stroke-width=".5" stroke-linecap="round" stroke-linejoin="round"></circle><line x1="7.56" y1="2" x2="1.72" y2="3.54" stroke="white" fill="none" stroke-width=".3" stroke-dasharray=".5"></line><path stroke="white" fill="none" d="M 2.9899999999999998 7.259999999999994 c 3.5999999999999996 -1.0999999999999996 -1.0999999999999994 -3.5500000000000003 2.450000000000001 -4.65" stroke-width=".5"></path></g></svg>
//   `;

  private svg = `
  <svg width="8" height="8" viewBox="0 0 8 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="background: none;">
  <line x1="1.96" y1="3.2199999999999998" x2="3.4999999999999996" y2="5.6" stroke="white" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width=".5"></line><line x1="5.820000000000001" y1="3.14" x2="4.14" y2="5.619999999999999" stroke="white" fill="none" stroke-linecap="butt" stroke-linejoin="miter" stroke-width=".5" stroke-dasharray=".5"></line><circle fill="none" stroke="white" cx="3.84" cy="6.58" r="1" stroke-width=".5"></circle><circle fill="none" stroke="white" cx="1.44" cy="2.38" r="1" stroke-width=".5"></circle><circle fill="none" stroke="white" cx="6.48" cy="2.32" r="1" stroke-width=".5" stroke-dasharray=".5"></circle></svg>
  `;

  constructor(
    private spawn: Spawn,
  ) {
    this.el = this.spawn.html.div(
      {},
      {
        display: 'inline-block',
        padding: '3px 3px',
        margin: '2px 2px 2px 5px',
        border: '1px dashed rgba(255,255,255,.1)',
        borderRadius: '3px',
        cursor: 'pointer',
        background: 'rgba(42,42,42,.7)',
        color: '#eee',
        'font-size': '10px',
        'user-select': 'none',
      }
    );
    const text = this.spawn.html.span();
    const icon = this.spawn.html.span();
    text.innerText = 'edit points';
    icon.innerHTML = this.svg;
    this.el.appendChild(icon);
    this.el.appendChild(text);

    this.el.onclick = (event: MouseEvent) => {
      this.editPoints(event);
    };

    this.hide();
  }

  appendTo(parentElement: HTMLElement) {
    parentElement.appendChild(this.el);
  }

  show() {
    this.spawn.html.update(this.el).styles({ 'display': 'inline-block' });
  }

  hide() {
    this.spawn.html.update(this.el).styles({ 'display': 'none' });
  }

  @makeMethodIterator()
  editPoints(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    return event;
  }

}
