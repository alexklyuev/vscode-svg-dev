import { PipeConnection } from "./pipe-connection";
import { pickPipe } from "../../shared/pipes/pick.pipe";
import { remoteAttributePipe } from "../../shared/pipes/remote-attribute.pipe";
import { artboardPipe } from "../../shared/pipes/artboard.pipe";
import { artboardStylePipe } from "../../shared/pipes/artboard-style.pipe";
import { loggerPipe } from "../../shared/pipes/logger.pipe";
import { zoomPipe } from "../../shared/pipes/zoom.pipe";
import { createPipe } from "../../shared/pipes/create.pipe";
import { flushPipe } from "../../shared/pipes/flush.pipe";
import { arrangePipe } from "../../shared/pipes/arrange.pipe";
import { elementPipe } from "../../shared/pipes/element.pipe";
import { groupPipe } from "../../shared/pipes/group.pipe";
import { cancelPipe } from "../../shared/pipes/cancel.pipe";


export const pickConnection = new PipeConnection(pickPipe);
export const remoteAttributeConnnection = new PipeConnection(remoteAttributePipe);
export const artboardConnection = new PipeConnection(artboardPipe);
export const artboardStyleConnection = new PipeConnection(artboardStylePipe);
export const loggerConnection = new PipeConnection(loggerPipe);
export const zoomConnection = new PipeConnection(zoomPipe);
export const createConnection = new PipeConnection(createPipe);
export const flushConnection = new PipeConnection(flushPipe);
export const arrangeConnection = new PipeConnection(arrangePipe);
export const elementConnection = new PipeConnection(elementPipe);
export const groupConnection = new PipeConnection(groupPipe);
export const cancelConnection = new PipeConnection(cancelPipe);

export const connections: PipeConnection<any, any, any>[] = [
    remoteAttributeConnnection,
    artboardConnection,
    artboardStyleConnection,
    loggerConnection,
    zoomConnection,
    createConnection,
    flushConnection,
    arrangeConnection,
    elementConnection,
    pickConnection,
    groupConnection,
    cancelConnection,
];