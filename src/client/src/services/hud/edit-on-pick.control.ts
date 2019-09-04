import { makeIterator } from "@/common/iterators";
import { Outlet } from "./models/outlet.model";
import { Spawn } from "../../../../lib/dom/spawner/spawn";


export class EditOnPick implements Outlet {

  public readonly el: HTMLElement;

  private isOn = false;

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
    text.innerText = 'edit on pick is off';
    this.el.appendChild(text);
    this.el.onclick = (event: MouseEvent) => {
      this.toggle(event);
      text.innerText = this.isOn ? 'edit on pick is on' : 'edit on pick is off';
    };
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this.el);
  }

  @makeIterator()
  toggle(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isOn = !this.isOn;
    return this.isOn;
  }

}
