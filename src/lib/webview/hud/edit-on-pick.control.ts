import { findMethodIterator } from "@/common/iterators";
import { spawner } from "@/dom/spawner";

import { Outlet } from "./models/outlet.model";
import { editPointsHub } from "../services/edit-points-hub";


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
    const text = spawner.html.span();
    const render = () => {
      text.innerHTML =  `edit on pick: ${ editPointsHub.editOnPick ? '<strong>on</strong>' : 'off' }`;
    };
    text.innerHTML = 'edit on pick: off';
    this.el.appendChild(text);
    this.el.onclick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      editPointsHub.editOnPick = !editPointsHub.editOnPick;
    };
    render();
    (async () => {
      const toggles = findMethodIterator(editPointsHub.editOnPickSet);
      for await (const _val of toggles) {
        render();
      }
    })();
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this.el);
  }

}
