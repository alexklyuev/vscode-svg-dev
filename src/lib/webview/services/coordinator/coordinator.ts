import { PointConcerns } from "../../models/point-concerns.model";

export class Coordinator {

    /**
     * //
     */
    render1d(
        point: number,
        scroll: number,
        margin: number,
        board: number,
        zoom: number,
        applyZoom: boolean,
    ): number {
        return (point + scroll - margin + board * (zoom - 1) / 2) / (applyZoom ? zoom : 1);
    }

    /**
     * //
     */
    render2d(
        client: [number, number],
        scroll: [number, number],
        margin: [number, number],
        board: [number, number],
        zoom: number,
        applyZoom: boolean,
    ): [number, number] {
        const dims: [number, number] = [0, 1];
        const cb = (dim: number) => {
            return this.render1d(
                client[dim],
                scroll[dim],
                margin[dim],
                board[dim],
                zoom,
                applyZoom,
            );
        };
        return dims.map(cb) as [number, number];
    }

    /**
     * //
     */
    renderPointConcerns(point: PointConcerns, applyZoom: boolean): [number, number] {
        const { client, scroll, margin, board, zoom } = point;
        return this.render2d(client, scroll, margin, board, zoom, applyZoom);
    }

}
