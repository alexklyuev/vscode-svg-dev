export class Coorinator {

    formula1d(
        point: number,
        scroll: number,
        margin: number,
        board: number,
        zoom: number,
        applyZoom: boolean,
    ): number {
        return (point + scroll - margin + board * (zoom - 1) / 2) / (applyZoom ? zoom : 1);
    }

    formula2d(
        point: [number, number],
        scroll: [number, number],
        margin: [number, number],
        board: [number, number],
        zoom: number,
        applyZoom: boolean,
    ): [number, number] {
        const dims: [number, number] = [0, 1];
        const cb = (dim: number) => {
            return this.formula1d(
                point[dim],
                scroll[dim],
                margin[dim],
                board[dim],
                zoom,
                applyZoom,
            );
        };
        return dims.map(cb) as [number, number];
    }

}
