import { Pipe } from "../../lib/common/pipe/pipe";

/**
 * Zoom (scale)
 */
export type ZoomRequest = {delta?: number; abs?: number};
export const zoomPipe = new Pipe<ZoomRequest, {}, 'zoom'>('zoom');
