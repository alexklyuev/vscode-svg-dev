export interface PointConcerns {
    client: [number, number];
    scroll: [number, number];
    margin: [number, number];
    board: [number, number];
    zoom: number;

    client2?: [number, number];
}

export type PointSharedConcerns = Pick<PointConcerns, 'scroll' | 'margin' | 'board' | 'zoom'>;
