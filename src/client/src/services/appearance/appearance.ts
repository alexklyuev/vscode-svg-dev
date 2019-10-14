import { makeMethodIterator } from "@/common/iterators";

/**
 * 
 */
export type AppearanceKeys = keyof Appearance;

/**
 * 
 */
export class Appearance {

    fill = 'green';
    stroke  = '#aaa';
    editControlPointFill = 'rgba(255,255,255,.8)';
    editControlPointStroke  = 'blue';
    editControlPointStrokeDasharray = '0';
    editControlPointRadius = '7';
    editBezierPointFill = 'red';
    editBezierPointStroke = 'red';
    editBezierPointStrokeDasharray = '1';
    editBezierPointRadius = '3';
    editBezierPointLineStroke = 'red';
    editBezierPointLineStrokeDasharray = '1';

    constructor() {
        const fire = this.fireChangeEvent.bind(this);
        const proxy = new Proxy(this, {
            get(target: any, key) {
                return target[key];
            },
            set(target: any, key, value) {
                target[key] = value;
                fire({
                    prop: key as string,
                    value,
                });
                return true;
            }
        });
        return proxy;
    }

    @makeMethodIterator()
    fireChangeEvent(data: {prop: string, value: string}) {
        return data;
    }

}

