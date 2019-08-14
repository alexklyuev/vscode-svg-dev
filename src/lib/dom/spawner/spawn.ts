export type Props = {[K: string]: string};

abstract class AbstractSpawner<T extends (HTMLElement | SVGElement)> {

  abstract create(name: string): T;

  element(
    name: string,
    attributes: Props,
    styles: Props,
  ) {
    const element = this.create(name);
    this.update(element, attributes, styles);
    return element;
  }

  update(el: T, attrs: Props = {}, styles: Props = {}) {
    Object.keys(attrs).forEach(key => {
      el.setAttribute(key, attrs[key]);
    });
    Object.assign(el.style, styles);
    return {
      attributes: (attrs: Props) => this.update(el, attrs),
      styles: (styles: Props) => this.update(el, {}, styles),
    };
  }

}

export class HtmlSpawner extends AbstractSpawner<HTMLElement> {

  create(name: string) {
    return document.createElement(name);
  }

  div(attrs: Props = {}, styles: Props = {}) {
    return this.element('div', attrs, styles) as HTMLDivElement;
  }

  span(attrs: Props = {}, styles: Props = {}) {
    return this.element('span', attrs, styles) as HTMLSpanElement;
  }

}

export class SvgSpawner extends AbstractSpawner<SVGElement> {

  create(name: string) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
  }

  svg(attrs: Props = {}, styles: Props = {}) {
    return this.element('svg', attrs, styles) as SVGSVGElement;
  }

  circle(attrs: Props = {}, styles: Props = {}) {
    return this.element('circle', attrs, styles) as SVGCircleElement;
  }

  rect(attrs: Props = {}, styles: Props = {}) {
    return this.element('rect', attrs, styles) as SVGRectElement;
  }

}

export class Spawn {

  constructor(
    public readonly html: HtmlSpawner,
    public readonly svg: SvgSpawner,
  ) {}

}