import { ZoomListener } from "./zoom.listener";
import { zoomPipe } from "@/shared/pipes/zoom.pipe";
import { zoom } from "@/web/init";


export const zoomListener = new ZoomListener(zoomPipe, zoom);
// zoomListener.listen();
