import { ConnectionsManager } from "./connections-manager";
import { PipeConnection } from "./pipe-connection";
import { pickPipe } from "../../lib/shared/pipes/pick.pipe";
import { remoteAttributePipe } from "../../lib/shared/pipes/remote-attribute.pipe";
import { artboardPipe, artboardInversePipe } from "../../lib/shared/pipes/artboard.pipe";
import { artboardStylePipe, artboardStyleInversePipe } from "../../lib/shared/pipes/artboard-style.pipe";
// import { loggerPipe } from "../../shared/pipes/logger.pipe";
import { zoomPipe } from "../../lib/shared/pipes/zoom.pipe";
import { createPipe } from "../../lib/shared/pipes/create.pipe";
import { flushPipe } from "../../lib/shared/pipes/flush.pipe";
import { arrangePipe } from "../../lib/shared/pipes/arrange.pipe";
import { elementPipe } from "../../lib/shared/pipes/element.pipe";
import { groupPipe } from "../../lib/shared/pipes/group.pipe";
import { cancelPipe } from "../../lib/shared/pipes/cancel.pipe";
import { artboardMovePipe } from "../../lib/shared/pipes/artboard-move.pipe";
import { editPipe } from "../../lib/shared/pipes/edit.pipe";
import { appearancePipe } from "../../lib/shared/pipes/appearance.pipe";
import { inverseInteractivePipe } from "../../lib/shared/pipes/inverse-interactive.pipe";
import { textReversePipe } from "../../lib/shared/pipes/text-reverse.pipe";
import { moveKeyPipe } from "../../lib/shared/pipes/move-key.pipe";
import { listAttributesPipe } from "../../lib/shared/pipes/list-attributes.pipe";
import { infomessagePipe } from "../../lib/shared/pipes/infomessage.pipe";
import { undoPipe } from "../../lib/shared/pipes/undo.pipe";
import { historyPipe } from "../../lib/shared/pipes/history.pipe";
import { configPipe } from "../../lib/shared/pipes/config.pipe";
import { editModePipe } from "../../lib/shared/pipes/edit-mode.pipe";


export const pickConnection = new PipeConnection(pickPipe);
export const remoteAttributeConnnection = new PipeConnection(remoteAttributePipe);
export const artboardConnection = new PipeConnection(artboardPipe);
export const artboardInverseConnection = new PipeConnection(artboardInversePipe);
export const artboardStyleConnection = new PipeConnection(artboardStylePipe);
export const artboardStyleInverseConnection = new PipeConnection(artboardStyleInversePipe);
export const artboardMoveConnection = new PipeConnection(artboardMovePipe);
// export const loggerConnection = new PipeConnection(loggerPipe);
export const zoomConnection = new PipeConnection(zoomPipe);
export const createConnection = new PipeConnection(createPipe);
export const editConnection = new PipeConnection(editPipe);
export const flushConnection = new PipeConnection(flushPipe);
export const arrangeConnection = new PipeConnection(arrangePipe);
export const elementConnection = new PipeConnection(elementPipe);
export const groupConnection = new PipeConnection(groupPipe);
export const cancelConnection = new PipeConnection(cancelPipe);
export const inverseInteractiveConnection = new PipeConnection(inverseInteractivePipe);
export const textReverseConnection = new PipeConnection(textReversePipe);
export const moveKeyConnection = new PipeConnection(moveKeyPipe);
export const listAttributesConnection = new PipeConnection(listAttributesPipe);
export const infomessageConnection = new PipeConnection(infomessagePipe);
export const undoConnection = new PipeConnection(undoPipe);
export const historyConnection = new PipeConnection(historyPipe);
export const configConnection = new PipeConnection(configPipe);
export const appearanceConnection = new PipeConnection(appearancePipe);
export const editModeConnection = new PipeConnection(editModePipe);

const connections: PipeConnection<any, any, any>[] = [
    remoteAttributeConnnection,
    artboardConnection,
    artboardInverseConnection,
    artboardStyleConnection,
    artboardStyleInverseConnection,
    artboardMoveConnection,
    // loggerConnection,
    zoomConnection,
    createConnection,
    editConnection,
    flushConnection,
    arrangeConnection,
    elementConnection,
    pickConnection,
    groupConnection,
    cancelConnection,
    appearanceConnection,
    inverseInteractiveConnection,
    textReverseConnection,
    moveKeyConnection,
    listAttributesConnection,
    infomessageConnection,
    undoConnection,
    historyConnection,
    configConnection,
    editModeConnection,
];

export const connectionsManager = new ConnectionsManager();
connectionsManager.addMulti(...connections);
