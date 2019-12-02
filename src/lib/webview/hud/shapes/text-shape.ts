import { Shape } from "./shape";
import { spawner } from "@/dom/spawner";
import { appearance } from "../../services/appearance";
import { appearanceEndpoint } from "@/webview/producers/appearance.producer";


export class TextShape extends Shape {

  constructor(
    name: string,
    iconSvg: string,
  ) {
    super(name, iconSvg);
    const size = spawner.html.span({}, {
        margin: '0 5px',
        border: '1px solid white',
        padding: '1px 3px',
        display: 'inline-block',
        'border-radius': '25%',
    });
    size.innerText = `${ appearance.textFontSize }`;
    this.el.appendChild(size);
    size.onclick = async event => {
        event.preventDefault();
        event.stopPropagation();
        const response = await appearanceEndpoint.makeGetRequest({
            name: 'fill',
            value: `${ appearance.textFontSize }`,
        });
        if (response) {
            const { value } = response;
            appearance.textFontSize = parseInt(value);
            size.innerText = `${ appearance.textFontSize }`;
        }
    };
  }

}
