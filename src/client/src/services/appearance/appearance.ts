import { ClientEvent, connectEvent } from "../../entities/client-event";

export class Appearance {

    private props = {
        fill: 'green',
        stroke : '#aaa',
        editControlPointFill: 'none',
        editControlPointStroke : '#666',
        editControlPointStrokeDasharray: '1',
        editControlPointRadius: '10',
        editBezierPointFill: 'red',
        editBezierPointStroke: 'red',
        editBezierPointStrokeDasharray: '1',
        editBezierPointRadius: '3',
        editBezierPointLineStroke: 'red',
        editBezierPointLineStrokeDasharray: '1',
    };

    public readonly changeEvent = new ClientEvent<{prop: string, value: string}>();

    @connectEvent('changeEvent')
    fireChangeEvent(data: {prop: string, value: string}) {}

    get fill() {
        return this.props.fill;
    }
    set fill(val: string) {
        this.props.fill = val;
        this.fireChangeEvent({prop: 'fill', value: val});
    }

    get stroke() {
        return this.props.stroke;
    }
    set stroke(val: string) {
        this.props.stroke = val;
        this.fireChangeEvent({prop: 'stroke', value: val});
    }

    get editControlPointFill() {
        return this.props.editControlPointFill;
    }
    set editControlPointFill(val: string) {
        this.props.editControlPointFill = val;
        this.fireChangeEvent({prop: 'editControlPointFill', value: val});
    }

    get editControlPointStroke() {
        return this.props.editControlPointStroke;
    }
    set editControlPointStroke(val: string) {
        this.props.editControlPointStroke = val;
        this.fireChangeEvent({prop: 'editControlPointStroke', value: val});
    }

    get editControlPointStrokeDasharray() {
        return this.props.editControlPointStrokeDasharray;
    }
    set editControlPointStrokeDasharray(val: string) {
        this.props.editControlPointStrokeDasharray = val;
        this.fireChangeEvent({prop: 'editControlPointStrokeDasharray', value: val});
    }

    get editControlPointRadius() {
        return this.props.editControlPointRadius;
    }
    set editControlPointRadius(val: string) {
        this.props.editControlPointRadius = val;
        this.fireChangeEvent({prop: 'editControlPointRadius', value: val});
    }

    get editBezierPointFill() {
        return this.props.editBezierPointFill;
    }
    set editBezierPointFill(val: string) {
        this.props.editBezierPointFill = val;
        this.fireChangeEvent({prop: 'editBezierPointFill', value: val});
    }

    get editBezierPointStroke() {
        return this.props.editBezierPointStroke;
    }
    set editBezierPointStroke(val: string) {
        this.props.editBezierPointStroke = val;
        this.fireChangeEvent({prop: 'editBezierPointStroke', value: val});
    }

    get editBezierPointStrokeDasharray() {
        return this.props.editBezierPointStrokeDasharray;
    }
    set editBezierPointStrokeDasharray(val: string) {
        this.props.editBezierPointStrokeDasharray = val;
        this.fireChangeEvent({prop: 'editBezierPointStrokeDasharray', value: val});
    }

    get editBezierPointRadius() {
        return this.props.editBezierPointRadius;
    }
    set editBezierPointRadius(val: string) {
        this.props.editBezierPointRadius = val;
        this.fireChangeEvent({prop: 'editBezierPointRadius', value: val});
    }

    get editBezierPointLineStroke() {
        return this.props.editBezierPointLineStroke;
    }
    set editBezierPointLineStroke(val: string) {
        this.props.editBezierPointLineStroke = val;
        this.fireChangeEvent({prop: 'editBezierPointLineStroke', value: val});
    }

    get editBezierPointLineStrokeDasharray() {
        return this.props.editBezierPointLineStrokeDasharray;
    }
    set editBezierPointLineStrokeDasharray(val: string) {
        this.props.editBezierPointLineStrokeDasharray = val;
        this.fireChangeEvent({prop: 'editBezierPointLineStrokeDasharray', value: val});
    }


}


export type ApKeys = keyof Appearance;
