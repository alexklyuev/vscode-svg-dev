import { findMethodIterator } from "@/common/iterators";
import { spawner } from "@/dom/spawner";
import { editHub } from "@/webview/services/edit-hub";

import { Outlet } from "./models/outlet.model";


export class EditOnPick implements Outlet {

  public readonly el: HTMLElement;

  constructor() {
    this.el = spawner.html.div(
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
    const prefix = spawner.html.span();
    prefix.innerHTML = 'edit on pick: ';
    const off = spawner.html.span({}, {padding: '5px'});
    const points = spawner.html.span({}, {padding: '5px'});
    const box = spawner.html.span({}, {padding: '5px'});
    this.el.appendChild(prefix);
    this.el.appendChild(off);
    this.el.appendChild(points);
    this.el.appendChild(box);
    const render = () => {
      off.innerHTML = editHub.editMode === 'off' ? '<strong>off</strong>' : 'off';
      points.innerHTML = editHub.editMode === 'points' ? '<strong>points</strong>' : 'points';
      box.innerHTML = editHub.editMode === 'box' ? '<strong>box</strong>' : 'box';
    };
    render();
    off.onclick = _event => {
      editHub.editMode = 'off';
    };
    points.onclick = _event => {
      editHub.editMode = 'points';
    };
    box.onclick = _event => {
      editHub.editMode = 'box';
    };
    (async () => {
      const toggles = findMethodIterator(editHub.editModeSet);
      for await (const _val of toggles) {
        render();
      }
    })();
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this.el);
  }

}
